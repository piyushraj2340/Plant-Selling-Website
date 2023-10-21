
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dcd6y2awx', 
    api_key: '575482163718861', 
    api_secret: 'otv-qz4V6uaMGEngM2rOSqTfO8I',
    secure: true
});

module.exports = cloudinary;