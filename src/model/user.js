const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');

const validator = require('validator');

const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!..."],
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "This email is already in used."],
        validate(email) {
            if(!validator.isEmail(email)) {
                throw new Error("Invalid Email");
            }
        }
    },
    phone: {
        type: String,
        required: true,
        unique: [true, "This phone is already in used."],
        validate(value) {
            if(value.toString().length != 10) {
                throw new Error("Invalid Phone!...");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    gender: {
        type: String,
    },
    age: {
        type: Number,
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

userSchema.pre("save",async function (next) {
    if(this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
})




const user = new mongoose.model('user', userSchema);

module.exports = user;