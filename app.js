var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/api', function(req, res){
    res.send('Hello World');
});

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
