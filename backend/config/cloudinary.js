const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dugxxzcct",
  api_key: "521653984132351",
  api_secret: "4pklY5sqRzdhVfO9xeezAvxdJxQ"
});

module.exports = cloudinary;