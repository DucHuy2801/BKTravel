'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const Tour = require("./tour.model")
const Location = require("./location")

const TourLocation = sequelize.define("tour_location", {
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
            model: Location,
            key: 'location_id'
        }
    }
})

Tour.belongsToMany(Location, { through: TourLocation })
Location.belongsToMany(Tour, { through: TourLocation })

module.exports = TourLocation