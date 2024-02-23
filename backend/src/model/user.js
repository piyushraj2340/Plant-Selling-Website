const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');

const validator = require('validator');

const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: [true, "This email is already in used."],
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid Email");
            }
        }
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: [true, "This phone is already in used."],
        validate(phone) {
            if (!validator.isMobilePhone(phone, 'en-IN')) {
                throw new Error("Invalid Phone");
            }
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: [String],
        default: ["user"]
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    avatarList: [{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    }],
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        validate(age) {
            if (!(age >= 18 && age <= 100)) {
                throw new Error("Invalid Age");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// generating the JWT Tokens 
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, { expiresIn: "6h" });
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
})




const user = new mongoose.model('user', userSchema);

module.exports = user;