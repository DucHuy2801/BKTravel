'use strict'

const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")

const Tour = sequelize.define("tour", {
    tour_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cover_image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description_place: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    current_customers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max_customer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    departure_place: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departure_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    destination_place: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    booked_number : {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    time: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departure_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deadline_book_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    highlight: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

// TourDetail.belongsTo(Tour)

module.exports = Tour