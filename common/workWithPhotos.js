const config = require('../config');

const fs = require('fs');
const shortid = require('shortid');

module.exports = {
  checkPuthFunc: ({ path }) => {
    if (!fs.existsSync(path)) {
      return false;
    }

    return true;
  },

  uploadPhotoFunc: async ({ typeImage, image }) => {
    const typeFile = typeImage.split('/').pop();
    const file = new Buffer.from(image, 'base64');

    if (['png', 'jpg', 'jpeg'].indexOf(typeFile) === -1) {
      throw {
        message: "Invalid file type!"
      };
    }

    if (Math.floor(file.length / 100000) / 10 > 1.5) {
      throw {
        message: "Image size exceeded!"
      };
    }

    const date = new Date();
    const folderName = `${config.months[date.getMonth()]}-${date.getFullYear()}`;
    let uploadPath = `${config.rootPath}/assets`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    uploadPath = `${config.rootPath}/assets/${folderName}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    uploadPath = `${uploadPath}/${shortid.generate()}.${typeFile}`;

    await fs.writeFileSync(uploadPath, file);

    return uploadPath;
  },

  deletePhotoFunc: ({ path }) => {

    fs.unlinkSync(path);

  },
};



