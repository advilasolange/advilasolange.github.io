const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
var PORT = process.env.PORT || 3000;

const app = express();

//teste github

//View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('member');
});

app.post('/sendMail', (req, res) => {
    const output = `
        <p>Presença confirmada</p>
        <h3>Detalhes</h3>
        <ul>
            <li>Nome: ${req.body.nome}</li>
            <li>Data de Nascimento: ${req.body.data}</li>
            <li>Telefone: ${req.body.telefone}</li>
        </ul>
        <h3>Mensagem</h3>
        <p>${req.body.mensagem}</p>
    `;

     // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'noreplay.advilasolange@gmail.com', // generated ethereal user
            pass: 'admsp@2019'  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"ADM Vila Solange" <noreplay.advilasolange@gmail.com>', // sender address
        to: 'levivirginio.silva@gmail.com, snzlary@gmail.com', // list of receivers
        subject: 'Lista de Presença', // Subject line
        text: 'Reunião de Obreiros', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Mensagem enviada: %s', info.messageId);   
        console.log('URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('member', {msg:'Email enviado com sucesso'});
    });
});

app.listen(PORT, () => console.log('Server started...'));