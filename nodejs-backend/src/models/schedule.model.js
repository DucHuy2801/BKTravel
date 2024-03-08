'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")

class Schedule extends Model {
    static associations(models) {
        this.hasMany(models.Attraction, {as: 'attractions'})
    }
}
Schedule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    schedule_detail: {
        type: DataTypes.JSON(),
        allowNull: false
    }
}, { sequelize, modelName: "schedule"} )

module.exports = Schedule