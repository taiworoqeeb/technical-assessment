const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")

const Message = sequelize.define("message", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
    },
    username:{
        type: DataTypes.STRING
    },
    data: {
        type: DataTypes.JSON
    }

}, {timestamps: true})

module.exports = {
    Message
}
