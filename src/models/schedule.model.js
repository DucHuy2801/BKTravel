'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")

const Schedule = sequelize.define("schedule", {
    schedule_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true
    }

    // continue
    
})

module.exports = Schedule