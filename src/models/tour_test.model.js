// 'use strict'

// const { DataTypes } = require("sequelize")
// const sequelize  = require("../database/index")

// const Tour = sequelize.define('tour', {
//     tour_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     amount: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     departure_date: {
//         type: DataTypes.DATE,
//         allowNull: false
//     },
//     departure_place: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     concentration_time: {
//         type: DataTypes.DATE,
//         allowNull: false
//     },
//     cover_image: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     price: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     },
//     highlight_tour: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     note: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     vote: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//         validate: {
//             min: 1,
//             max: 5
//         }
//     }
// })

// // Tour.hasMany(TourDetail)

// module.exports = Tour