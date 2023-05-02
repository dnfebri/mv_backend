var { responseJson } = require("./Respont.js");
var path = require("path");

const responseUpload = (status, message, name = null) => {
  return {
    status,
    message,
    name,
  };
};

exports.uploadImage = (files, name) => {
  if (files === null || files.photo === null)
    return responseUpload(false, "File no upload");
  const image = files.photo;
  const imageSize = image.data.length;
  const ext = path.extname(image.name);
  const filenane = name + ext;
  const allowedType = [".png", ".jpg", ".jpeg"];
  if (!allowedType.includes(ext.toLowerCase())) {
    return responseUpload(false, "invalid Image");
  }
  if (imageSize > 3000000) {
    return responseUpload(false, "Image must be less than 3 MB");
  }
  image.mv(`./public/images/${filenane}`, async (err) => {
    if (err) return responseUpload(false, err);
  });
  return responseUpload(true, "Successfully", `/images/${filenane}`);
};

exports.uploadPost = (files, name) => {
  if (files === null || files.image === null)
    return responseUpload(false, "Image not upload");
  const image = files.image;
  const imageSize = image.data.length;
  const ext = path.extname(image.name);
  const filenane = name + ext;
  const allowedType = [".png", ".jpg", ".jpeg"];
  if (!allowedType.includes(ext.toLowerCase())) {
    return responseUpload(false, "invalid Image");
  }
  if (imageSize > 3000000) {
    return responseUpload(false, "Image must be less than 3 MB");
  }
  image.mv(`./public/images/posts/${filenane}`, async (err) => {
    if (err) return responseUpload(false, err);
  });
  return responseUpload(true, "Successfully", `/images/posts/${filenane}`);
};
