const { DataTypes } = require('sequelize');
const sequelize = require("../../../config/sequelizeConfig");
/**
 * wxapp表结构
 * 
 * CREATE TABLE `test`.`wxapp_copy1`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `m_w` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `hisprice` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `paytype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `d` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `act` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `payment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `payall` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `w` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `m` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `avatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `y` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `_openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16449 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

 */
/**
 * 定义wxappItem表模型
 */
const Wxappc = sequelize.define('wxappc', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  _id: {
      type: DataTypes.STRING,
      allowNull: true
  },
  m_w: {
      type: DataTypes.STRING,
      allowNull: true
  },  
  province: {
      type: DataTypes.STRING,
      allowNull: true
  },  
  gender: {
      type: DataTypes.STRING,
      allowNull: true
  },
  hisprice: {
      type: DataTypes.STRING,
      allowNull: true
  },      
  openid: {
      type: DataTypes.STRING,
      allowNull: true
  },
  amount: {
      type: DataTypes.STRING,
      allowNull: true
  },
  paytype: {
      type: DataTypes.STRING,
      allowNull: true
  },
  d: {
      type: DataTypes.STRING,
      allowNull: true
  },
  act: {
      type: DataTypes.STRING,
      allowNull: true
  },
  type: {
      type: DataTypes.STRING,
      allowNull: true
  },
  date: {
      type: DataTypes.STRING,
      allowNull: true
  },
  payment: {
      type: DataTypes.STRING,
      allowNull: true
  },
  icon: {
      type: DataTypes.STRING,
      allowNull: true
  },
  payall: {
      type: DataTypes.STRING,
      allowNull: true
  },
  w: {
      type: DataTypes.STRING,
      allowNull: true
  },
  remarks: {
      type: DataTypes.STRING,
      allowNull: true
  },
  m: {
      type: DataTypes.STRING,
      allowNull: true
  },
  avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true
  },
  nickname: {
      type: DataTypes.STRING,
      allowNull: true
  },
  city: {
      type: DataTypes.STRING,
      allowNull: true
  },
  language: {
      type: DataTypes.STRING,
      allowNull: true
  },
  y: {
      type: DataTypes.STRING,
      allowNull: true
  },
  text: {
      type: DataTypes.STRING,
      allowNull: true
  },
  _openid: {
      type: DataTypes.STRING,
      allowNull: true
  },
  country: {
      type: DataTypes.STRING,
      allowNull: true
  }
},{
  timestamps: false,
  tableName: 'wxappc'
});
module.exports = Wxappc;