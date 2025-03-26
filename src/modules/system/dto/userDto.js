const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).max(100).when('$isUpdate', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.required()
  }),
  realName: Joi.string().max(50),
  email: Joi.string().email().max(50),
  mobile: Joi.string().pattern(/^1[3-9]\d{9}$/),
  status: Joi.number().valid(0, 1),
  deptId: Joi.number(),
  roleIds: Joi.array().items(Joi.number()),
  remark: Joi.string().max(500)
});

exports.validateUser = (data, isUpdate = false) => {
  return userSchema.validate(data, {
    context: { isUpdate }
  });
}; 