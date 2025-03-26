const { DataTypes } = require('sequelize');
// 将数据库链接对象导入
const sequelize = require('../../../config/mysqlConnection');
// 创建模型
const Theme = sequelize.define('theme', {
    theme_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 标题
    theme_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    theme_description: DataTypes.TEXT,
    theme_position: DataTypes.STRING,
    theme_position_detail: DataTypes.STRING,
    theme_cover: DataTypes.STRING,
    theme_date: DataTypes.DATE,
    delete_date: DataTypes.DATE,
    is_delete: DataTypes.STRING,
    photo_ids: DataTypes.STRING,
},{
    freezeTableName: true,
    timestamps: true,
    createdAt: 'create_date',
    updatedAt: false,
    id: 'theme_id'
});
// 导出模型
module.exports = Theme;