'use strict'

const OrderItem = require("../models/order_item.model")

const findOrderItem = async (order_id, tour_id) => {
    return await OrderItem.findOne({
        where: {
            order_id: order_id,
            tour_id: tour_id
        }
    })
}

module.exports = {
    findOrderItem
}