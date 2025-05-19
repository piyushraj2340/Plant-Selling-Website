const validator = require("validator");
const userModel = require('../../../model/userModel/user');
const { validateStrongPassword } = require("../../../utils/validateStrongPassword");

module.exports = async (req, res, next) => {
  try {
    let { name, email, phone, gender, age, password, confirmPassword } = req.body;


    name = name?.toString().trim();
    email = email?.toString().trim().toLowerCase(); 
    phone = phone?.toString().trim();
    gender = gender?.toString().trim().toLowerCase(); 
    password = password?.toString().trim();
    confirmPassword = confirmPassword?.toString().trim();
    age = age?.toString().trim();

    if (!name) throw new Error("Name is required!");
    if (name.length < 3) throw new Error("Name must be at least 3 characters long!");
    if (name.length > 50) throw new Error("Name must be at most 50 characters long!");

    if (!email) throw new Error("Email is required!");
    if (!validator.isEmail(email)) throw new Error("Email is not valid!");
    const existingEmail = await userModel.findOne({ email }).select("email");
    if (existingEmail) throw new Error("Email already exists!");

    if (!phone) throw new Error("Phone number is required!");
    if (!validator.isMobilePhone(phone, "en-IN")) throw new Error("Phone number is invalid!");
    const existingPhone = await userModel.findOne({ phone }).select("phone");
    if (existingPhone) throw new Error("Phone number already exists!");

    if (!age) throw new Error("Age is required!");
    age = parseInt(age);
    if (isNaN(age)) throw new Error("Age must be a number!");
    if (age < 18 || age > 100) throw new Error("Age must be between 18 and 100!");

    if (!password) throw new Error("Password is required!");
    if (!confirmPassword) throw new Error("Confirm Password is required!");
    if (password !== confirmPassword) throw new Error("Passwords do not match!");

    if (!validateStrongPassword(password)) {
      throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
    }

    req.body = { name, email, phone, gender, age, password, confirmPassword };
    next();

  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
