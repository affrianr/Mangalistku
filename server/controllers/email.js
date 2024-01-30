const nodemailer = require('nodemailer');
 
 
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'projek.afr@gmail.com',
        pass: 'inipassword123456'
    }
});
 
let mailDetails = {
    from: 'projek.afr@gmail.com',
    to: 'affrianr11@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs');
    } else {
        console.log('Email sent successfully');
    }
});