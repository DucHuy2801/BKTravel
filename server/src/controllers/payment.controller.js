'use strict'

const moment = require('moment');
const { sortObject } = require("../utils/payment")
let querystring = require('qs');
const crypto = require('crypto');
const { findTourById } = require('../services/tour.service');
const OrderItem = require('../models/order_item.model');


const tmnCode = process.env.vnp_TmnCode;
const secretKey = process.env.vnp_HashSecret;
let url = process.env.vnp_Url;
const returnUrl = process.env.vnp_ReturnUrl;

class PaymentController {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @body {
     *      amount,
     *      bankCode,
     *      orderDescription,
     *      orderType,
     *      language
     * }
     */
    createPaymentUrl = async (req, res, next) => {
        let totalPrice = 0;
        for (const item of req.body.order_items) {
            const order_item = await OrderItem.findOne({ where: { id: item }});
            const adultTotal = order_item.adult_quantity * parseFloat(order_item.price);
            const childTotal = 0.75 * order_item.child_quantity * parseFloat(order_item.price);
            let total_item = adultTotal + childTotal;
            totalPrice += parseFloat(total_item);
            let tour = await findTourById(order_item.tour_id)
            if (tour.current_customers >= tour.max_customer)
                return res.status(400).json({ message: "Tour is full!"})
            tour.current_customers = order_item.adult_quantity + order_item.child_quantity
            await tour.save()
        }

        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
    
        let ipAddr = req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
    
        let orderId = moment(date).format('DDHHmmss');
        let amount = totalPrice + 100;
        let bankCode = 'NCB';
    
        let vnpUrl = url;
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ve du lich`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_BankCode'] = bankCode;
    
        vnp_Params = sortObject(vnp_Params);
    
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        vnp_Params['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        return res.status(200).json({
            link_payment: vnpUrl
        }) 
    }

    getResultPayment = async (req, res, next) => {
        try {
            const vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];
    
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];
    
            const sortedParams = sortObject(vnp_Params);
    
            const signData = querystring.stringify(sortedParams, { encode: false });  
            
            const hmac = crypto.createHmac("sha512", process.env.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
            if(secureHash === signed){
                const orderId = vnp_Params['vnp_TxnRef'];
                const rspCode = vnp_Params['vnp_ResponseCode'];
                
                if (rspCode === '00') {
                    return res.status(200).json({ RspCode: '00', Message: 'Success' });
                } else {
                    return res.status(200).json({ RspCode: rspCode, Message: 'Transaction failed' });
                }
            } else {
                return res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    returnPayment = async (req, res, next) => {
        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];
    
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
    
        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    
        if (secureHash === signed) {
            res.send({ code: vnp_Params["vnp_ResponseCode"] });
        } else {
            res.send({ code: "97" });
        }
    }
}

module.exports = new PaymentController()