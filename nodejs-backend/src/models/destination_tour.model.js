'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const Tour = require("./tour.model")
const Destination = require("./destination.model")

class DestinationTour extends Model {}
DestinationTour.init({
    destination_tour_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, { sequelize, modelName: "destination_tour" })

Tour.belongsToMany(Destination, { through: DestinationTour, foreignKey: "tour_id" })
Destination.belongsToMany(Tour, { through: DestinationTour, foreignKey: "destination_id" })

module.exports = DestinationTour