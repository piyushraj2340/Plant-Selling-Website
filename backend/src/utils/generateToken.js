const crypto = require('crypto');


const generateToken = () => {
    return crypto.randomBytes(32).toString('hex'); // 32 bytes of random data, converted to hex string
};

const generateUniqueLinkWithToken  = (path)  => {
    const token = generateToken();
    const link = process.env.FRONTEND_URL + '/' + path + '/' + token;
    return {token, link};
}

const generateSecureOTP = () => {
    const otp = crypto.randomInt(100000, 1000000); // Generates a number between 100000 and 999999
    return otp.toString();
};

module.exports = { generateToken, generateUniqueLinkWithToken, generateSecureOTP };