const  WelcomeEmailTemplate  = require("../template/JoinTeam");

const nodemailer = require("nodemailer");


async function SendJoinTeamEmail (email , teamName , URL){
      try{
      const transporter = nodemailer.createTransport({
            // Configure the transporter with your email service provider details
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'udas4153@gmail.com',
                pass: process.env.EMAIL_PASS,
              },
            });
      
            const mailOptions = {
              from: 'udas4153@gmail.com',
              to: email,
              subject: 'Thank You for Joining WorkZen',
              html: WelcomeEmailTemplate("WorkZen" , teamName , URL),
            };
      
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ok: false, msg: 'Failed to send reset email' });
              } else {
                // console.log('Email sent: ' + info.response);
                return res.status(200).json({ ok: true, msg: 'Reset email sent' });
              }
            });
      }catch(er){
            console.log(er);
      }
      
}

module.exports = {SendJoinTeamEmail};