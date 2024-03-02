'use strict'

const Destination = require("../models/destination.model")

class DestinationController {
    getAllDestinations = async(req, res, next) => {
        try {
            const all_destinations = await Destination.findAll({
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            })
            return res.status(200).json({
                message: "Get all destinations successfully!",
                data: all_destinations
            })
        } catch(error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new DestinationController()