const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendMail = async(receiverEmail,subject,body) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: receiverEmail,
        subject: subject,
        html: body
    });
};

module.exports = sendMail;