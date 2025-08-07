const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,//jo env mein credentials daale the usko bula rhe
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "placeme_DEV",//mtb koi bhi user daalega picit has to save with this name
        allowedformats: ["png", "jpg", "jpeg"],//this should be its end
    },
});

module.exports = {
    cloudinary,
    storage,
};
