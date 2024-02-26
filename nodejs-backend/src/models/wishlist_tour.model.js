'use strict'

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/index');
const Wishlist = require('./wishlist.model');
const Tour = require('./tour.model');

class WishlistTour extends Model {}
WishlistTour.init({
    wishlist_tour_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    wishlist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, { sequelize, modelName: "wishlist_tour" })

Wishlist.belongsToMany(Tour, { through: WishlistTour, foreignKey: "wishlist_id" })
Tour.belongsToMany(Wishlist, { through: WishlistTour, foreignKey: "tour_id" })

module.exports = WishlistTour