var stripe = require('stripe')(process.env.STRIPE_KEY);
var mcapi = require('mailchimp-api');
var express = require('express');

var mc = new mcapi.Mailchimp(process.env.MAILCHIMP_KEY);

var app = express();

app.use(express.compress());
app.use(express.bodyParser());
app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] &&
        req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});
app.use(express.static(__dirname + '/public'));

app.post('/form/contributions', function(req, res){
    var token = req.body.stripeToken;

    stripe.charges.create({
        amount: 400,
        currency: "usd",
        card: token,
        description: "Test charge"
    }, function(err, data) {
        console.log(err, data);
    });

    console.log(req.body);
    res.send('Got it.');
});

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
