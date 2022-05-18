const mongoose= require('mongoose')
const crypto = require("crypto")
const validator= require('validator')
const brypt= require('bcryptjs')


const userSchema= new mongoose.Schema({
    firstname : {
        type: String,
        required: [true, 'Please provide a firstname'],
        trim: true
    },
    lastname : {
        type: String,
        required: [true, 'Please provide a lastname'],
        trim: true
    },
    email : {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
        lowercase: true,
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'guide', 'lead-guide', 'admin'],
        },
        default: 'user'
    },
    password : {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Passsword must be longer than 8 characters'],
        select: false
    },
    confirmPassword : {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(val){
                return this.password==val
            },
            message: 'Passwords do not match'
        },
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    picture: String,
})

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next()
    this.password= await brypt.hash(this.password, 12)

    this.confirmPassword= undefined
    next()
})

 
userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    return false;
  }

userSchema.methods.createPaswordResetToken= function(){
    const resetToken= crypto.randomBytes(32).toString('hex')
    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires= Date.now() + 10 * 60 * 1000
    return resetToken
}

const User= mongoose.model('User', userSchema)

module.exports= User