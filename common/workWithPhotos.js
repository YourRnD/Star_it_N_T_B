const config = require('../config');

const fs = require('fs');
const cloudinary = require('cloudinary');
const _ = require('lodash');

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
  checkPuthFunc: async ({ paths }) => {
    let check = true;

    if (!_.isArray(paths)) {
      return false;
    }

    for (let i = 0; i < paths.length; i++) {
      const correctPath = pathConvector(paths[i]);

      await cloudinary.v2.api.resources_by_ids([correctPath], (error, result) => {
        if (error || result.resources.length === 0) {
          check = false;
        }
      })
    }

    return check;
  },

  uploadPhotoFunc: async ({ base64 }) => {

    let path = [];

    for (let i = 0; i < base64.length; i++) {
      const response = await cloudinary.v2.uploader.upload(base64[i].base64Img, (error, result) => {
        if (error) {
          return {
            error: true,
            message: 'Invalid file!'
          }
        }
        return result;
      });

      if (response.error === true) {
        throw { message: response.message }
      }

      path.push(response.url);
    }

    return path;
  },

  deletePhotoFunc: async ({ paths }) => {

    for (let i = 0; i < paths.length; i++) {
      const correctPath = pathConvector(paths[i]);

      await cloudinary.v2.api.delete_resources([correctPath], (error, result) => {
        if (error) {
          throw { message: 'Error' }
        }
      })
    }
  },
};



