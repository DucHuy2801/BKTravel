'use strict'

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/index")

const Order = require("./order.model");
const Destination = require("./destination.model");

const { StatusTour } = require("../common/status");

class Tour extends Model {}
Tour.init({
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
    status: {
        type: DataTypes.ENUM(StatusTour.WAITING, StatusTour.ONLINE, StatusTour.DELETED),
        defaultValue: StatusTour.WAITING,
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
},  { sequelize, modelName: 'tour' })

// Tour.hasMany(Order, { foreignKey: 'tour_id' });
// Tour.belongsTo(Destination, { foreignKey: 'destination_id' })

module.exports = Tour