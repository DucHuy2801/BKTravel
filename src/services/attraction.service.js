'use strict'

const Attraction = require("../models/attraction.model")
const Destination = require('../models/destination.model');

const checkExistAttraction = async (attraction_name, destination_name) => {
    return await Attraction.findOne({
        where: { name: attraction_name },
        include: [{
            model: Destination,
            where: { name: destination_name },
            attributes: [] 
        }]
    });
};

module.exports = {
    checkExistAttraction
}