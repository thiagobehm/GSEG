const nodemailer = require('nodemailer');


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: '',
    pass: ''
  }
});

// setup email data with unicode symbols
function enviarEmail(data) {
  let mailOptions = {
    from: data.nome + '<' + data.email + '>',
    to: 'thiagoluisbehm@gmail.com',
    subject: data.assunto,
    text: data.descricao
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    transporter.close();
  });

}
// send mail with defined transport object

transporter.verify(function(err, success) {
  return err; // 'Invalid recipient'
});


module.exports = {
  enviarEmail,
  transporter
};
