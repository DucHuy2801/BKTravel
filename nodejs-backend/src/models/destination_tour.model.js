'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const Tour = require("./tour.model")
const Destination = require("./destination.model")

const DestinationTour = sequelize.define("destination_tour", {
    destination_tour_id: {
        type: DataTypes.INIEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tour,
            key: 'tour_id'
        }
    },
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Destination,
            key: 'destination_id'
        }
    }
})

Tour.belongsToMany(Location, { through: DestinationTour })
Destination.belongsToMany(Tour, { through: DestinationTour })

module.exports = DestinationTour