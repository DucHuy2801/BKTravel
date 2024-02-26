'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")

class Attraction extends Model {}

Attraction.init({
    attraction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { sequelize, modelName: 'attraction' })

module.exports = Attraction;