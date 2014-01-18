var thanksUrl = 'https://www.coleforcongress.com/#confirmed';

var stripe = require('stripe')(process.env.STRIPE_KEY);
var express = require('express');

var app = express();

app.use(express.compress());
app.use(express.bodyParser());
app.use(function(req, res, next) {
    var host = req.headers.host;
    host = (host.substr(0, 4) !== 'www.') ? 'www.' + host : host;

    if (req.headers['x-forwarded-proto'] &&
        req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(301, 'https://' + host + req.url);
    }
    next();
});
app.use(express.static(__dirname + '/public/_site'));

app.get('/ofa', function(req, res) {
    res.sendfile('ofa.html', { root: './public/_site' });
});

app.post('/form/contributions', function(req, res) {
    var b = req.body;
    var token = b.stripeToken;
    var metaData = {
        fname: b.fname,
        lname: b.lname,
        phone: b.phone,
        email: b.email,
        employer: b.employer,
        occupation: b.occupation
    };

    stripe.customers.create({
        description: 'Online contributor',
        card: token,
        email: b.email,
        metadata: metaData
    }, function(err, customer) {
        console.warn(err);
        stripe.charges.create({
            amount: b.amount * 100,
            currency: 'usd',
            customer: customer.id,
            description: 'Online contribution',
            metadata: metaData
        }, function(err, data) {
            console.warn(err);
            res.redirect(thanksUrl);
        });
    });
});

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
