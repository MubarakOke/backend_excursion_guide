const dotenv= require('dotenv')
const mongoose= require('mongoose')
dotenv.config({path: "./config.env"})
const app= require('./app')

const DB= process.env.DATABASE

mongoose.connect(DB).then((con)=>{
    console.log("DB connection successful")
}).catch(()=>{
    console.log("DB connection unsuccessful")
})

const port= 3000
app.listen(port,()=>{
    console.log(`App running on port ${port}`)
})