const User= require('../models/userModel')


exports.getUsers= async (req, res)=>{
    try{
        const user= await User.find()

        res.status(200).json({
            status: 'success',
            data: user
        })}
    catch(err){
        console.log(err)
        res.status(400).json({
            status: 'fail'
        })
    }
}
   
exports.getUser= async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            result: user.length,
            data: user
        })
    }
    catch{
        console.log(err)
        res.status(400).json({
            status: 'fail'
        })
    } 
    }
   
exports.updateUser= (req, res)=>{
    console.log("update User")
    }

exports.deleteUser= (req, res)=>{
    console.log("delete User")
    }