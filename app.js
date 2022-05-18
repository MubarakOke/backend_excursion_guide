const express= require('express')
const morgan= require('morgan')
const tourRouter= require('./routes/tourRouter')
const userRouter= require('./routes/userRouter')

const app= express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use('/api/v1/tour', tourRouter)
app.use('/api/v1/user', userRouter)

module.exports= app