'use strict'

const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/order_item.model");
const User = require("../models/user.model")
const { findOrderItem } = require("../services/order.service");
const { findTourById } = require("../services/tour.service");
const { findUserById, checkOrderByUser } = require("../services/user.service");

class CartController {
    /**
     * @body {
     *      user_id,
     *      tour: {
     *          tour_id,
     *          adult_quantity,
     *          child_quantity
     *      }
     * }
     * @returns(200)
     */
    addTourToCart = async (req, res, next) => {
        try {
            const user_id = req.body.user_id;
            const user = await findUserById(user_id)
            if (!user) return res.status(404).json({ message: "Not found user!" })
    
            // create cart if user doesn't have
            const [cart, cart_created] = await Cart.findOrCreate({
                where: { user_id: user_id, cart_id: user_id },
                defaults: { cart_id: user_id, user_id: user_id }
            })
    
            // check order by user if it doesn't create new_order
            const order = await checkOrderByUser(user_id)
            let new_order
            if (!order) {
                new_order = await Order.create({
                    user_id: user_id,
                    total: 0
                })
            }
            const order_id = order ? order.order_id : new_order.order_id
    
            // check order_item in order if it isn't, create order_item
            const { tour_id, adult_quantity, child_quantity } = req.body.tour
            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour!" })
    
            const order_item = await OrderItem.findOne({
                where: { order_id: order_id, tour_id: tour_id }
            })
            let orderItem
            if (!order_item) {
                orderItem = await OrderItem.create({
                    tour_id: tour_id,
                    price: tour.price,
                    quantity: adult_quantity + child_quantity,
                    adult_quantity: adult_quantity,
                    child_quantity: child_quantity,
                    order_id: order_id
                })
            } else {
                order_item.adult_quantity += adult_quantity,
                order_item.child_quantity += child_quantity
                order_item.quantity += (adult_quantity + child_quantity)
                await order_item.save()
            }
            
            // update total of order
            const child_order = orderItem ? orderItem.child_quantity : order_item.child_quantity;
            const adult_order = orderItem ? orderItem.adult_quantity : order_item.adult_quantity

            const new_total = parseFloat(adult_order * (tour.price)) + parseFloat(0.75 * child_order * (tour.price))
            if (!order) {
                new_order.total= new_total; 
                await new_order.save()
            } else {
                order.total = new_total + parseFloat(order.total);
                await order.save()
            }
            return res.status(200).json({
                message: "Add tour to cart successfully!",
                cart: order ? order : new_order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    /**
     * 
     * @param {user_id} req 
     */
    getCartByUser = async (req, res, next) => {
        const user_id = req.params.user_id;

        const cart = await User.findByPk(user_id, {
            include: [{
              model: Order,
              include: OrderItem 
            }]
        })
        return res.status(200).json({
            message: "Get cart successfully!",
            data: cart
        })
    }

    /**
     * 
     * @body {
     *      user_id,
     *      tour_id
     * } 
     * @returns 
     */
    incrementAdultQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const order = await checkOrderByUser(user_id)
            if (!order) return res.status(404).json({ message: "Not found order of user!"})
    
            const order_item = await findOrderItem(order.order_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})
            order_item.adult_quantity++;
            order_item.quantity++;
            await order_item.save()
            
            const new_total = parseFloat(order.total) + parseFloat(order_item.price)
            order.total = new_total;
            await order.save()

            return res.status(200).json({ 
                message: "Increase quantity of order item successfully!",
                cart: order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    decrementAdultQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const order = await checkOrderByUser(user_id)
            if (!order) return res.status(404).json({ message: "Not found order of user!"})
    
            const order_item = await findOrderItem(order.order_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})
            order_item.adult_quantity--;
            order_item.quantity--;
            await order_item.save()

            if (order_item.quantity == 0) {
                await order_item.destroy()
            }
            
            const new_total = parseFloat(order.total) - parseFloat(order_item.price)
            order.total = new_total <= 0 ? 0 : new_total;
            await order.save()

            return res.status(200).json({ 
                message: "Decrease quantity of order_item successfully!",
                cart: order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    incrementChildQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const order = await checkOrderByUser(user_id)
            if (!order) return res.status(404).json({ message: "Not found order of user!"})
    
            const order_item = await findOrderItem(order.order_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})
            order_item.child_quantity++;
            order_item.quantity++;
            await order_item.save()
            
            const new_total = parseFloat(order.total) + parseFloat(0.75 * order_item.price)
            order.total = new_total;
            await order.save()

            return res.status(200).json({ 
                message: "Increase quantity of order item successfully!",
                cart: order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    decrementChildQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const order = await checkOrderByUser(user_id)
            if (!order) return res.status(404).json({ message: "Not found order of user!"})
    
            const order_item = await findOrderItem(order.order_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})
            order_item.child_quantity--;
            order_item.quantity--;
            await order_item.save()

            if (order_item.quantity == 0) {
                await order_item.destroy()
            }
            
            const new_total = parseFloat(order.total) - parseFloat(0.75 * order_item.price)
            order.total = new_total <= 0 ? 0 : new_total;
            await order.save()

            return res.status(200).json({ 
                message: "Decrease quantity of order_item successfully!",
                cart: order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    deleteOrderItem = async (req, res, next) => {
        try {
            const user_id = req.params.user_id
            const tour_id = req.body.tour_id
            const order = await checkOrderByUser(user_id)
            if (!order) return res.status(404).json({ message: "Not found order" })
            const order_item = await OrderItem.findOne({
                where: {
                    user_id: user_id,
                    tour_id: tour_id
                }
            })
            if (!order_item) return res.status(404).json({ message: "Not found order_item!" })
            // update total of order
            order.total = parseFloat(order.total) - parseFloat(order_item.quantity * order_item.price);
            await order.save()
            
            await order_item.destroy()
            return res.status(200).json({ 
                message: "Remove order_item from order successfully!",
                cart: order
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new CartController()