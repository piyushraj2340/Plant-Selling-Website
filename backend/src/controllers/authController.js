const userModel = require('../model/user');
const bcryptjs = require('bcryptjs');

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