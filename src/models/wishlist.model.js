'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")
const User = require("./user.model")
const Tour = require("./tour.model")

class Wishlist extends Model {}

Wishlist.init(
    {
        wishlist_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    { sequelize, modelName: 'wishlist' }
);

User.belongsToMany(Tour, { through: Wishlist, foreignKey: 'user_id' })
Tour.belongsToMany(User, { through: Wishlist, foreignKey: 'tour_id' })

module.exports = Wishlist