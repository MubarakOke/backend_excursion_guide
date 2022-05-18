const nodemailer = require('nodemailer')

const sendEmail= async options=>{
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      }) 
      
    const mailOptions= {
                    from: 'Mubarak <mubarak@jonas.io>',
                    to: options.email,
                    subject: options.subject,
                    text: options.message,
                }
    await transport.sendMail(mailOptions)  
}

module.exports= sendEmail
// const transporter= nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//        user: process.env.EMAIL_USERNAME,
//        password: process.env.EMAIL_PASSWORD  
//     }
// })