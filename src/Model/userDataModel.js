const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const documentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        uppercase: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email Dekh Lo Behen, Kuch GAdbad Kar Di Hai Aapne..");
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },

    mobile: {
        type: Number,
        unique: true,
        required: true,
        validate(value) {
            if (value.length < 10 || value.length > 10) {
                throw new Error("Galat Number Deti Ho.. Paap Lagega..");
            }
        },
    },
    tokenVal:[{
        firstToken:{
            type: String,
            required: true,
        },
    }],

});


documentSchema.methods.createToken = async function(){
    const generateToken = jwt.sign({id: this._id.toString()}, process.env.SECRET_KEY);

    this.tokenVal = this.tokenVal.concat({firstToken: generateToken});
    return generateToken;
}


documentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 9);
        this.confirmPassword = undefined;
    }
    next();
})

const createCollection = new mongoose.model("UserRegistrationData", documentSchema);

module.exports = createCollection;