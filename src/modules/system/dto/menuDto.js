const Joi = require('joi');

const menuSchema = Joi.object({
  parentId: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': '父菜单ID必须是数字',
      'number.integer': '父菜单ID必须是整数',
      'number.min': '父菜单ID不能小于0'
    }),

  menuName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': '菜单名称必须是字符串',
      'string.min': '菜单名称长度不能小于2个字符',
      'string.max': '菜单名称长度不能大于50个字符',
      'any.required': '菜单名称不能为空'
    }),

  path: Joi.string()
    .max(200)
    .allow('')
    .optional()
    .messages({
      'string.base': '路由地址必须是字符串',
      'string.max': '路由地址长度不能大于200个字符'
    }),

  component: Joi.string()
    .max(200)
    .allow('')
    .optional()
    .messages({
      'string.base': '组件路径必须是字符串',
      'string.max': '组件路径长度不能大于200个字符'
    }),

  permission: Joi.string()
    .max(100)
    .allow('')
    .optional()
    .messages({
      'string.base': '权限标识必须是字符串',
      'string.max': '权限标识长度不能大于100个字符'
    }),

  menuType: Joi.string()
    .valid('M', 'C', 'F')
    .default('M')
    .messages({
      'string.base': '菜单类型必须是字符串',
      'any.only': '菜单类型只能是M、C或F'
    }),

  icon: Joi.string()
    .max(100)
    .allow('')
    .optional()
    .messages({
      'string.base': '菜单图标必须是字符串',
      'string.max': '菜单图标长度不能大于100个字符'
    }),

  orderNum: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': '显示顺序必须是数字',
      'number.integer': '显示顺序必须是整数',
      'number.min': '显示顺序不能小于0'
    }),

  isFrame: Joi.number()
    .valid(0, 1)
    .default(1)
    .messages({
      'number.base': '是否外链必须是数字',
      'any.only': '是否外链只能是0或1'
    }),

  status: Joi.number()
    .valid(0, 1)
    .default(1)
    .messages({
      'number.base': '状态必须是数字',
      'any.only': '状态只能是0或1'
    }),

  visible: Joi.number()
    .valid(0, 1)
    .default(1)
    .messages({
      'number.base': '显示状态必须是数字',
      'any.only': '显示状态只能是0或1'
    })
});

exports.validateMenu = (data, isUpdate = false) => {
  const schema = isUpdate ? menuSchema.fork(['menuName'], (schema) => schema.optional()) : menuSchema;
  return schema.validate(data, {
    allowUnknown: true,
    stripUnknown: true
  });
}; 