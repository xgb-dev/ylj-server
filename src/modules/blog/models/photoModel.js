const { DataTypes } = require('sequelize');
// 将数据库链接对象导入
const sequelize = require('../../../config/mysqlConnection');
// 创建模型
const Photo = sequelize.define('photo', {
    // 图片标题
    photo_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // 图片详情描述，不是必填
    photo_description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // 图片大小，不是必填
    photo_size: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // 图片url地址，必填
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // 图片场景的实际地址，不是必填
    photo_position: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    freezeTableName: true,
    timestamps: false
});
// 导出模型
module.exports = Photo;