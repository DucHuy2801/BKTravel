'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const Attraction = require("./attraction.model")

class Destination extends Model {}

Destination.init({
    destination_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { sequelize, modelName: 'destination' })

module.exports = Destination

Destination.hasMany(Attraction, { foreignKey: 'destination_id' })