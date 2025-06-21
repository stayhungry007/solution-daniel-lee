'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

module.exports = sequelize.define('revision', {
    issue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    changes: {
        type: Sequelize.JSONB,
        allowNull: false,
    },
    updated_by: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'revisions',
});