const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const session = require('express-session');
const mail = require('./mail.js');

//configures a variable because of heroku
const port = process.env.PORT || 3000;

var app = express();

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

app.use(expressValidator());

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'max',
  saveUninitialized: true,
  resave: false
}));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'GSEG Seguradora',
    success: session.success = false,
    erros: false,
    data: '',
    mailError: {
      error: false,
      message: ''
    }
  });
});

// Renderiza o form
app.post('/form', urlencodedParser, (req, res) => {
  req.check('nome', 'Nome é um campo obrigatório').notEmpty();
  req.check('email', 'Email Inválido').isEmail();
  req.check('descricao', 'Campo descrição é obrigaório').notEmpty();


  req.getValidationResult().then(function(result) {

    mail.transporter.verify().then(function(con) {
      session.mailError = '';

      if (result.isEmpty()) {
        mail.enviarEmail(req.body);
        session.success = true;
        session.data = '';
        session.erros = '';
      } else {
        session.success = false;
        session.erros = result.array();
        session.data = req.body;
      }

      res.render('partials/contato.hbs', {
        success: session.success,
        erros: session.erros,
        data: session.data,
        mailError: session.mailError
      });

    }).catch(function(con) {

      session.mailError = {
        error: true,
        message: 'Falha ao enviar o email. Tente novamente mais tarde, por favor!'
      };

      res.render('partials/contato.hbs', {
        success: false,
        erros: session.erros,
        data: session.data,
        mailError: session.mailError
      });

    });
  });

});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
