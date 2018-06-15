const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 5000;

app.use(session({
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: true
}));

app.get('/session', (req, res) => {
//   res.send({ express: 'Hello From Express' });
    req.session.number = 5;
    res.send({message: req.session.number + 'Your number has been saved'});
});

app.get('/check', (req, res) => {
    number = req.session.number;
    res.send({number: number});
    // if (req.session.message) {
    //     res.send({message: 'Your message is: ' + req.session.message});
    // } else {
    //     res.send({message: 'Error retrieving message from session'});
    // }
});



app.listen(port, () => console.log(`Listening on port ${port}`));