const jwt= require('jsonwebtoken')
const {promisify}= require('util')
const User= require('../models/userModel')
const sendEmail= require('../utils/email') 

const signToken= (id)=>{
    return jwt.sign({id:id}, process.env.SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN})
}

exports.signup= async (req, res)=>{
    try{
        const firstname= req.body.firstname
        const lastname= req.body.lastname
        const password= req.body.password
        const email= req.body.email
        const confirmPassword = req.body.confirmPassword
        const passwordChangedAt= req.body.passwordChangedAt
        const user=  await User.create({firstname, lastname, password, email, confirmPassword, passwordChangedAt})
        const token= signToken(user._id)
        res.status(200).json({
        status: 'success',
        data: {user,
               token}
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            status: 'fail'
        })
    }
    
   }

exports.login= async(req, res)=>{
    console.log("inside login")
    const {email, password}= req.body
    let user= null
    let correct= null
    if(!email || !password){
        return res.status(401).json({
            status: 'please enter email and password'
         })
         
    }
    try{
        user= await User.findOne({email}).select("+password")
    }
    catch{
        return res.status(401).json({
            status: 'user not found'
        })
    }
    try{  
        correct= await user.correctPassword(password, user.password)
    }
    catch{
        return res.status(401).json({
            status: 'incorrect email or password'
        })
        return
    }
    if (!user || !correct){
        return res.status(401).json({
            status: 'incorrect email or password'
        })
    }
    const token= signToken(user._id)
    return res.status(200).json({
        status: 'success',
        data: {user,
            token}
    })
}

exports.protect= async (req, res, next)=>{
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return res.status(400).json({
            status: 'Please specify token'
            })
    }
    let decoded
    let user
    let changeP
    const token= req.headers.authorization.split(' ')[1]
    try{
        decoded= await promisify(jwt.verify)(token, process.env.SECRET_KEY)
    }catch{
        return res.status(400).json({
            status: 'Token not found'
            })
    }
    if(!decoded){
        return res.status(400).json({
            status: 'Please log in to access content'
            })   
    }
    try{
        user= await User.findById(decoded.id) 
        if(!user){
            return res.status(400).json({
                status: 'user can not be found'
                })
        }
    }
    catch {
        return res.status(400).json({
            status: 'user can not be found'
            })
    }
     
    if(user.changedPasswordAfter(decoded.iat)){
        return res.status(400).json({
            status: 'user recently changed password'
            })
    }    
    req.user= user
    next()
}

exports.restrictTo= (...roles)=>{

    return (req, res, next)=>{
        if (!roles.includes(req.user.role)){
            return res.status(403).json({
                status: 'permission not allowed'
                })
        }
        next()

    }
}

exports.forgotPassword= async (req, res)=>{
  let user
  let resetToken
  if(!req.body.email){
    return res.status(400).json({
        status: 'please enter your email'
        })
  }
  try{
    const email= req.body.email
    user= await User.findOne({email})
    if(!user){
        return res.status(400).json({
            status: 'User not found'
            })
        }

    resetToken= user.createPaswordResetToken()
    await user.save({validateBeforeSave : false})

    }
    catch{
        return res.status(400).json({
            status: 'user not found'
            })
    }

    try{
        const resetURL= `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
        const message= `click on this link to enter your new password /n ${resetURL}`
        await sendEmail({email: user.email, 
                        subject: 'reset email link valid for 10 mins',
                        message})
            
        res.status(200).json({
        status: 'success',
        message: 'Token sent to email'
        })
    }
    catch{
        user.passwordResetToken= undefined
        user.passwordResetexpires= undefined
        await user.save({validateBeforeSave : false})
        return res.status(500).json({
            status: 'There was an error sending email'
            })
    }

}

exports.resetPassword= ()=>{

}