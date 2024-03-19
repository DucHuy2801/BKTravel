'use strict'

const OrderItem = require("../models/order_item.model")

const findOrderItem = async (user_id, tour_id) => {
    return await OrderItem.findOne({
        where: {
            order_id: user_id,
            tour_id: tour_id
        }
    })
}

module.exports = {
    findOrderItem
}