const userModel = require('../model/userModel/user');
const bcryptjs = require('bcryptjs');
const { generateUniqueLinkWithToken, generateToken, generateSecureOTP } = require('../utils/generateToken');
const { confirmAccountSendEmail, resetPasswordSendEmail, sendOTP } = require('./smtp/emailController');
const jwt = require('jsonwebtoken');
const { setData, getData, deleteData } = require('../utils/redisService');
const { decryptMessage } = require('../utils/cryptoUtil');
const user = require('../model/userModel/user');
const validator = require('validator');

//* POST Routes
exports.signUp = async (req, res, next) => {
    try {

        let { name, email, phone, gender, age, password, confirmPassword } = req.body;

        const newUser = new userModel({ name, email, phone, gender, age, password, confirmPassword });
        await newUser.save();

        //* Generate unique token and link for email verification
        const { token, link } = generateUniqueLinkWithToken("account/verificationConfirmation");

        //* Save the token in redis database with expire time 15 min.
        await setData('root', token, 'verifyUser', { userId: newUser.id }, 900);

        //* Send Email with smtp to activate user account
        const isEmailSent = await confirmAccountSendEmail(newUser.email, newUser.name, link);

        if (!isEmailSent) {

            //* Deleting the token from the redis database
            await deleteData('root', token, 'verifyUser');

            const error = new Error("Failed to send email verification");
            error.statusCode = 500;
            throw error;
        }

        const info = {
            status: true,
            message: "User Account successfully created, and need to verify you email address",
            result: {
                email: newUser.email
            }
        }

        return res.status(201).send(info);

    } catch (err) {
        next(err); //! Pass the error to the global error middleware
    }
};

//* POST Routes
exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //* find the email 
        const result = await userModel.findOne({ email });

        //! If Email is not found
        if (!result) {
            const error = new Error("Login Failed");
            error.statusCode = 403;
            throw error;
        }

        //* Compare password 
        const isPassMatch = await bcryptjs.compare(password, result.password);

        //! Password not matched
        if (!isPassMatch) {
            const error = new Error("Login Failed");
            error.statusCode = 403;
            throw error;
        }

        //! if User is not verified 
        if (!result.isUserVerified) {

            //* Generate unique token and link for email verification
            const { token, link } = generateUniqueLinkWithToken("account/verificationConfirmation");

            //* Save the token in redis database with expire time 15 min.
            await setData('root', token, 'verifyUser', { userId: result.id }, 900); // 60sec * 15min = 900sec

            //* Send Email with smtp to activate user account
            const isEmailSent = await confirmAccountSendEmail(result.email, result.name, link);

            if (!isEmailSent) {

                //* Deleting the token from the redis database
                await deleteData('root', token, 'verifyUser');

                const error = new Error("Failed to send email verification");
                error.statusCode = 500;
                throw error;
            }


            const info = {
                status: false,
                message: "You need to verify your account",
                code: "VerifyUser",
            }

            return res.status(403).send(info);
        }

        if (result.isTwoFactorAuthEnabled) {
            //* Generate unique token and link for email verification
            const token = generateToken();

            const otp = generateSecureOTP();

            //* Save the token in redis database with expire time 15 min.
            await setData('root', token, 'TwoFactorAuthEnabled', { otp, userId: result._id }, 900); // 60sec * 15min = 900sec

            //* Send Email with smtp to activate user account
            const isEmailSent = await sendOTP(result.email, result.name, otp);

            if (!isEmailSent) {

                //* Deleting the token from the redis database
                await deleteData('root', token, 'TwoFactorAuthEnabled');

                const error = new Error("Failed to send otp email verification");
                error.statusCode = 500;
                throw error;
            }


            const info = {
                status: false,
                message: "two factor authentication needed",
                code: "TwoFactorAuth",
                token
            }

            return res.status(403).send(info);
        }

        //* Generate Auth Token
        const token = await result.generateAuthToken();

        const { refreshToken, accessToken } = token;

        if (!refreshToken) {
            const error = new Error("Failed to generate refresh token");
            error.statusCode = 500;
            throw error;
        }

        //* extracting data from result
        const userInfo = { ...result._doc };

        //! deleting the confidential data  before sending
        delete userInfo.password;
        delete userInfo.__v;

        const info = {
            status: true,
            message: "Login Successful",
            result: userInfo,
            token: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        }

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};

//* GET Routes
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        
        if (refreshToken) {
            const tokenData = await getData("auth", refreshToken, "refreshToken");
            if (tokenData) {
                // Mark token as revoked
                tokenData.revoked = true;
                await setData("auth", refreshToken, "refreshToken", tokenData, 604800);
                
                // Optionally blacklist the family
                await setData("authBlacklist", tokenData.familyId, "familyId", true, 604800);
            }
        }

        const info = {
            status: true,
            message: "Logout Successfully."
        };
        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};

//* GET Routes
exports.checkUser = async (req, res, next) => {
    try {
        const result = await userModel.findOne({ _id: req.user });

        if (!result) {
            const error = new Error("Authentication Failed");
            error.statusCode = 403;
            throw error;
        }

        const info = {
            status: true,
            message: "User Check Passed."
        };
        res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};


exports.resetUserPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        //! Check if the email parameter is valid
        if (!email) {
            const error = new Error("Email is required");
            error.statusCode = 400;
            throw error;
        }

        //^ Find the user based on the email
        const user = await userModel.findOne({ email });

        if (!user) {
            const error = new Error("Email is not valid");
            error.statusCode = 400;
            throw error;
        }

        //* Generate unique token and link for email verification
        const { token, link } = generateUniqueLinkWithToken("account/ResetYourPassword");

        //* Save the token in redis database with expire time 15 min.
        await setData('root', token, 'resetPassword', { userId: user.id }, 900);

        //* Send Email with smtp to activate user account
        const isEmailSent = await resetPasswordSendEmail(user.email, user.name, link);

        if (!isEmailSent) {

            //* Deleting the token from the redis database
            await deleteData('root', token, 'resetPassword');

            const error = new Error("Failed to send email verification");
            error.statusCode = 500;
            throw error;
        }


        const info = {
            status: true,
            message: "Password Reset Email Sent Successfully",
        }

        return res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
}


exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        const tokenData = await getData("auth", refreshToken, "refreshToken");

        if (!tokenData) {
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        // Check for Replay Attack
        if (tokenData.revoked) {
            // Replay attack detected! Blacklist the entire family.
            await setData("authBlacklist", tokenData.familyId, "familyId", true, 604800);
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        // Check if family is blacklisted
        const isFamilyBlacklisted = await getData("authBlacklist", tokenData.familyId, "familyId");
        if (isFamilyBlacklisted) {
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        const user = await userModel.findOne({ _id: tokenData.userId });

        if (!user) {
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        // Mark the current token as revoked
        tokenData.revoked = true;
        await setData("auth", refreshToken, "refreshToken", tokenData, 604800);

        // Generate Auth Token (creates new RT and AT)
        const token = await user.generateAuthToken();

        // Update the new token's familyId to match the existing family
        const newTokenData = await getData("auth", token.refreshToken, "refreshToken");
        if (newTokenData) {
            newTokenData.familyId = tokenData.familyId;
            await setData("auth", token.refreshToken, "refreshToken", newTokenData, 604800);
        }

        const info = {
            status: true,
            message: "New Token Generated!",
            token: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
            }
        }

        return res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
}


exports.validateOtp = async (req, res, next) => {
    const { token } = req.params;

    try {

        //! Token does not exist
        if (!token) {
            const error = new Error("Invalid Token Parameters");
            error.statusCode = 404;
            throw error;
        }

        //^ Get data form the redis database
        const otpData = await getData('root', token, 'TwoFactorAuthEnabled');

        //! User does not exist in the redis db or the user token got expired after few minutes 
        if (!otpData) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 404;
            throw error;
        }

        //* Getting Data from the form body
        const { otp } = req.body;

        if (!otp) {
            const error = new Error("Otp Parameter Missing");
            error.statusCode = 405;
            throw error;
        }

        if (otp.toString() !== otpData.otp.toString()) {
            const error = new Error("Otp does not match");
            error.statusCode = 405;
            throw error;
        }

        //^ Checking if the user exists in the mongodb database
        const user = await userModel.findOne({ _id: otpData.userId });
        // const user = await userModel.findOne({_id: otpData.userId}).select({ password: 0, tokens: 0, __v: 0 });

        //! If User does not exist 
        if (!user) {

            //* Deleting the token from the redis database
            await deleteData('root', token, 'TwoFactorAuthEnabled');

            const error = new Error("You are not verified, you may need to re-try");
            error.statusCode = 403;
            throw error;
        }

        //* extracting data from result
        const userInfo = { ...user._doc };

        //! deleting the confidential data  before sending
        delete userInfo.password;
        delete userInfo.tokens;
        delete userInfo.__v;

        //* Deleting the token from the redis database
        await deleteData('root', token, 'TwoFactorAuthEnabled');

        //* Generate Auth Token
        const authToken = await user.generateAuthToken();

        const { refreshToken, accessToken } = authToken;

        if (!refreshToken) {
            const error = new Error("Failed to generate refresh token");
            error.statusCode = 500;
            throw error;
        }

        const info = {
            status: true,
            message: "Verification Completed successfully",
            result: userInfo,
            token: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        }

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}


exports.validateOtpToken = async (req, res, next) => {
    const { token } = req.params;

    try {

        //! Token does not exist
        if (!token) {
            const error = new Error("Invalid Token Parameters");
            error.statusCode = 404;
            throw error;
        }

        //^ Get data form the redis database
        const otpData = await getData('root', token, 'TwoFactorAuthEnabled');

        //! User does not exist in the redis db or the user token got expired after few minutes 
        if (!otpData) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Valid TwoFactor Authentication Token",
        }

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}


exports.resendOtp = async (req, res, next) => {
    const { token } = req.params;

    try {
        //! Token does not exist
        if (!token) {
            const error = new Error("Invalid Token Parameters");
            error.statusCode = 404;
            throw error;
        }

        //^ Get data form the redis database
        const otpData = await getData('root', token, 'TwoFactorAuthEnabled');

        //! User does not exist in the redis db or the user token got expired after few minutes 
        if (!otpData) {
            const error = new Error("Token Expired or does not exist");
            error.statusCode = 404;
            throw error;
        }

        const result = await user.findById(otpData.userId);

        const otp = generateSecureOTP();

        //* Save the token in redis database with expire time 15 min.
        await setData('root', token, 'TwoFactorAuthEnabled', { otp, userId: result._id }, 900); // 60sec * 15min = 900sec

        //* Send Email with smtp to activate user account
        const isEmailSent = await sendOTP(result.email, result.name, otp);

        if (!isEmailSent) {

            //* Deleting the token from the redis database
            await deleteData('root', token, 'TwoFactorAuthEnabled');

            const error = new Error("Failed to send otp email verification");
            error.statusCode = 500;
            throw error;
        }


        const info = {
            status: false,
            message: "Otp Resend Successfully",
            code: "TwoFactorAuth",
            token
        }

        return res.status(200).send(info);

    } catch (error) {
        next(error); //! Pass the error to the error handling middleware
    }
}