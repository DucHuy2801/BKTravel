const { DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const role_user = {
    ADMIN: 'admin',
    GUIDER: 'guider',
    CUSTOMER: 'customer'
}

const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firstname: {
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
    phone_number: {
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
    role_user: {
        type: DataTypes.ENUM(role_user.ADMIN, role_user.GUIDER, role_user.CUSTOMER),
        allowNull: false
    }
})

module.exports = User;