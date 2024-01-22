'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const TourDetail = require("./tour_detail.model")
const Location = require("./location")

const TourDetailLocation = sequelize.define("tour_detail_location", {
    tour_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TourDetail,
            key: 'tour_detail_id'
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

TourDetail.belongsToMany(Location, { through: TourDetailLocation })
Location.belongsToMany(TourDetail, { through: TourDetailLocation })

module.exports = TourDetailLocation