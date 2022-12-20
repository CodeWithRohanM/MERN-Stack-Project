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


// generating Token When User Registers and LogIn
documentSchema.methods.createToken = async function(){
    const generateToken = jwt.sign({id: this._id.toString()}, process.env.SECRET_KEY);

    this.tokenVal = this.tokenVal.concat({firstToken: generateToken});
    
    this.confirmPassword = await bcrypt.hash(this.password, 9); // we need to define this because while saving the document in database, it checks all the documentSchema and it requires all field to be there.

    this.save(); // Saving beacuse we have to concatenate the tokens every time user registers or login
    return generateToken;
}



// Converting Password into HASH before storing it into Database
// i.e Before SAVE method
documentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 9);
        this.confirmPassword = undefined;
    }
    next();
})

const createCollection = new mongoose.model("UserRegistrationData", documentSchema);

module.exports = createCollection;