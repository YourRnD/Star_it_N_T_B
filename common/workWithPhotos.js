const config = require('../config');

const fs = require('fs');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: config.imageCloudName,
  api_key: config.imgageApiKey,
  api_secret: config.imageApiSecret
});

const pathConvector = (path) => {
  let id = path.split('/').pop();
  return id.split('.')[0];
}

module.exports = {
  checkPuthFunc: async ({ path }) => {
    const correctPath = pathConvector(path);

    const check = await cloudinary.v2.api.resources_by_ids([correctPath], (error, result) => {
      if (error || result.resources.length === 0) {
        return false;
      }

      return true;
    })

    return check;
  },

  uploadPhotoFunc: async ({ base64 }) => {
    const response = await cloudinary.v2.uploader.upload(base64, (error, result) => {
      if (error) {
        throw { message: 'Error' }
      }
      return result;
    });

    return response.url;
  },

  deletePhotoFunc: ({ path }) => {
    const correctPath = pathConvector(path);

    cloudinary.v2.api.delete_resources([correctPath], (error, result) => {
      if (error) {
        throw { message: 'Error' }
      }
    })

  },
};



