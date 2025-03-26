const { Op } = require("sequelize");
const Theme = require('../models/themeModel');
const Photo = require('../models/photoModel');

/**
 * 新增
 * @param {新增的数据字段} saveData 
 * @returns 
 */
async function createTheme(saveData) {
  try {
    let newTheme = await Theme.create(saveData);
    await newTheme.save();
    return newTheme;
  } catch (error) {
    return Promise.reject(error);
  }
}
/**
 * 更新单条信息
 * @param {更新的字段} changeData 
 * @param {查询条件} where 
 * @returns 
 */
async function updateTheme(changeData, where) {
  try {
    let updateTheme = await Theme.update(changeData, {where});
    return updateTheme;
  } catch (error) {
    return Promise.reject(error);
  }
}
/**
 * 删除单条
 * @param {删除时，根据Id} where 
 * @returns 
 */
async function deleteTheme(where) {
  try {
    let deleteTheme = await Theme.destroy({where});
    return deleteTheme;    
  } catch (error) {
    return Promise.reject(error);
  }
}
/**
 * 获取主题列表
 * @param {分页页面} offset 
 * @param {分页条数} limit 
 * @param {查询条件 ORM sequelize 相关} where 
 * @returns async直接返回Promise，所以成功时直接返回数据即可，错误时返回了Promise的reject
 */
async function findAllTheme(offset, limit, where) {
  try {
    const {count, rows} = await Theme.findAndCountAll({
      attributes: ['theme_id', 'theme_title', 'theme_description', 'theme_position', 'theme_cover', 'theme_date', 'create_date'],
      where: where,
      offset: offset,
      limit: limit
    });
    return {rows, count};
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * 获取明细
 * @param {查询条件 ORM sequelize 相关} where 
 * @returns 
 */
async function findThemeItem(where) {
  try {
    const item = await Theme.findOne({
      where
    });
    let photo_ids = item.photo_ids;
    let photos = [];
    if(photo_ids){
      photos = await Photo.findAll({
        where: {
          id: {
            [Op.in]: photo_ids.split(',')
          }
        }
      });
    }
    return Object.assign(item, {photo_ids: photos});
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  createTheme,
  updateTheme,
  deleteTheme,
  findAllTheme,
  findThemeItem
};