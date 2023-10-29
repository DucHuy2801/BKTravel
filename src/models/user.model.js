const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")

const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isLongEnough: function(value) {
                if (value.length < 6) {
                    throw new Error("Password is weak, invite to enter other password!")
                }
            }
        }
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isData: true
        }
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [10-12]
        }
    },
    gmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        defaultValue: 3
    },
})

module.exports = User;