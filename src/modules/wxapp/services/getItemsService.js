const Wxappc = require('../models/getItemsModel');

const getByOpenId = async ({openid, page}) =>  {
  try {
    const wxapp = await Wxappc.findAll({
      where: {
          _openid: openid
      },
      limit: 20,
      offset: (page - 1) * 20
    });
    // const wxappByDay = wxapp.reduce((acc, item) => {
    //   const day = item.date.split('-')[2];
    //   if (!acc[day]) {
    //       acc[day] = [];
    //   }
    //   acc[day].push(item);
    //   return acc;
    // }, {});
    return wxapp
  } catch (error) {
    throw error;
  } 
}
module.exports = {
  getByOpenId
};
