// lib/models/user.js
const Sequelize = require('sequelize');
const sequelize = require('./connection');  // Your DB connection
const bcrypt = require('bcryptjs');

module.exports = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            // Hash password before saving
            user.password = await bcrypt.hash(user.password, 10);
        },
    },
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users',
});
