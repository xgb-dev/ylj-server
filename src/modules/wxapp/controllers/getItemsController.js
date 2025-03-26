const wxappService = require('../services/getItemsService');
const ApiResponse = require('../../../utils/response');
const { NotFoundError, AppError } = require('../../../utils/errors');

const getByOpenId = async (req, res, next) => {
  try {
    const {openid, page} = req.body;
    const wxappItems = await wxappService.getByOpenId({openid, page});
    res.status(200).json(ApiResponse.success(wxappItems));
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getByOpenId
};