const userModel = require('../model/user');
const bcryptjs = require('bcryptjs');
const { generateUniqueLinkWithToken } = require('../utils/generateToken');
const { setData, deleteData } = require('../utils/redisVercelKv');
const { confirmAccountSendEmail, resetPasswordSendEmail } = require('./smtp/emailController');

//* POST Routes
exports.signUp = async (req, res, next) => {
    try {
        const newUser = new userModel(req.body);

        const token = await newUser.generateAuthToken();
        await newUser.save();

        const userInfo = { ...newUser._doc };
        delete userInfo.password;
        delete userInfo.tokens;
        delete userInfo.__v;

        res.cookie('auth', token, {
            expires: new Date(Date.now() + 50000000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        const info = {
            status: true,
            message: "User Registration Successful",
            result: userInfo
        }

        res.status(201).send(info);

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
            error.statusCode = 401;
            throw error;
        }

        //* Compare password 
        const isPassMatch = await bcryptjs.compare(password, result.password);

        //! Password not matched
        if (!isPassMatch) {
            const error = new Error("Login Failed");
            error.statusCode = 401;
            throw error;
        }

        //! if User is not verified 
        if (!result.isUserVerified) {

            //* Generate unique token and link for email verification
            const { token, link } = generateUniqueLinkWithToken("account/verificationConfirmation");

            //* Save the token in redis database with expire time 15 min.
            await setData('root', token, 'verifyUser', { userId: result.id }, 900);

            //* Send Email with smtp to activate user account
            const isEmailSent = await confirmAccountSendEmail(result.email, result.name, link );

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
            }

            return res.status(401).send(info);
        }

        //* Generate Auth Token
        const token = await result.generateAuthToken();

        //* extracting data from result
        const userInfo = { ...result._doc };

        //! deleting the confidential data  before sending
        delete userInfo.password;
        delete userInfo.tokens;
        delete userInfo.__v;

        //* setting the cookie into the browser 
        res.cookie('auth', token, {
            expires: new Date(Date.now() + 50000000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        const info = {
            status: true,
            message: "Login Successful",
            result: userInfo
        }

        res.status(200).send(info);
    } catch (error) {
        next(error); //! Pass the error to the global error middleware
    }
};

//* GET Routes
exports.logout = async (req, res, next) => {
    try {
        const result = await userModel.findByIdAndUpdate(req.user, {
            $pull: {
                tokens: {
                    token: req.token
                }
            }
        });

        //! if the user not found 
        if (!result) {
            const error = new Error("Logout failed");
            error.statusCode = 400;
            throw error;
        }

        //* remove the auth session cookie
        res.clearCookie('auth', {
            sameSite: 'none',
            secure: true
        });

        //* remove the order auth session
        res.clearCookie('orderSession', {
            sameSite: 'none',
            secure: true
        });

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
            error.statusCode = 401;
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
