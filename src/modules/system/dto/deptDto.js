const Joi = require('joi');

const deptSchema = Joi.object({
  parentId: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': '父部门ID必须是数字',
      'number.integer': '父部门ID必须是整数',
      'number.min': '父部门ID不能小于0'
    }),

  deptName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': '部门名称必须是字符串',
      'string.min': '部门名称长度不能小于2个字符',
      'string.max': '部门名称长度不能大于50个字符',
      'any.required': '部门名称不能为空'
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

  leader: Joi.string()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.base': '负责人必须是字符串',
      'string.max': '负责人长度不能大于50个字符'
    }),

  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .allow('')
    .optional()
    .messages({
      'string.base': '联系电话必须是字符串',
      'string.pattern.base': '请输入正确的手机号码'
    }),

  email: Joi.string()
    .email()
    .max(50)
    .allow('')
    .optional()
    .messages({
      'string.base': '邮箱必须是字符串',
      'string.email': '请输入正确的邮箱地址',
      'string.max': '邮箱长度不能大于50个字符'
    }),

  status: Joi.number()
    .valid(0, 1)
    .default(1)
    .messages({
      'number.base': '状态必须是数字',
      'any.only': '状态只能是0或1'
    })
});

exports.validateDept = (data, isUpdate = false) => {
  const schema = isUpdate ? deptSchema.fork(['deptName'], (schema) => schema.optional()) : deptSchema;
  return schema.validate(data, {
    allowUnknown: true,
    stripUnknown: true
  });
}; 