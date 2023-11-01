var nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const Log = require('../log');
require('dotenv').config();



async function registerMail(data){

    Log.error('Hello again distributed logs');
    return true;
    console.log('data',data)
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
    });


    const temp = {
        title: "John Doe",
        heading: "heading",
        content: "helllo world",
    };
    const template = fs.readFileSync(__dirname+"/../Views/email_templates/participants.ejs", "utf-8");
    const html = ejs.render(template, temp);

    var mailOptions = {
    from: process.env.EMAIL,
    to: 'imranmir.websenor@gmail.com',
    subject: 'Sending Email using Node.js',
    html: html,

    attachments: [
        {
          filename: 'flower.jpeg', //this object cid is used to show image of html code 
          path: './public/assets/flower.jpeg',
          cid: 'unique-image-id', // Use this CID in the template to reference the image
        },

        {
            filename: 'flower.pdf',
            path: './public/pdf/50c8096b-3977-40e2-96a9-e38414800a08.pdf',
          },

      ],


    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}
module.exports={registerMail}