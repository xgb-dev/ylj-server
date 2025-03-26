const Joi = require('joi');

const roleSchema = Joi.object({
  roleName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': '角色名称必须是字符串',
      'string.min': '角色名称长度不能小于2个字符',
      'string.max': '角色名称长度不能大于50个字符',
      'any.required': '角色名称不能为空'
    }),

  roleKey: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': '权限标识必须是字符串',
      'string.min': '权限标识长度不能小于2个字符',
      'string.max': '权限标识长度不能大于50个字符',
      'any.required': '权限标识不能为空'
    }),

  roleSort: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': '显示顺序必须是数字',
      'number.integer': '显示顺序必须是整数',
      'number.min': '显示顺序不能小于0'
    }),

  status: Joi.number()
    .valid(0, 1)
    .default(1)
    .messages({
      'number.base': '状态必须是数字',
      'any.only': '状态只能是0或1'
    }),

  remark: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.base': '备注必须是字符串',
      'string.max': '备注长度不能大于500个字符'
    }),

  menuIds: Joi.array()
    .items(Joi.number().integer().min(1))
    .optional()
    .messages({
      'array.base': '菜单ID必须是数组',
      'number.base': '菜单ID必须是数字',
      'number.integer': '菜单ID必须是整数',
      'number.min': '菜单ID必须大于0'
    })
});

exports.validateRole = (data, isUpdate = false) => {
  const schema = isUpdate ? roleSchema.fork(['roleName', 'roleKey'], (schema) => schema.optional()) : roleSchema;
  return schema.validate(data, {
    allowUnknown: true,
    stripUnknown: true
  });
}; 