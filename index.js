var express = require('express');
var app = express();
var expressHandlebars  = require('express-handlebars');
var request = require('request');

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/api/search', function(req, res) {
	search_query = req.query["search_query"];
	console.log(search_query);
	request({
	    headers: {
	      'user-key': 'a264a9ad763b2a66d83aa1c7004d1b7a'
	    },
	    uri: 'https://developers.zomato.com/api/v2.1/search?entity_type=city&q=' + search_query,
	    method: 'GET'
	}, function (err, apiRes, body) {
		console.log(apiRes.body);
	    if(err){
	    	res.status(500).json({ success : false, message : 'Something went wrong!! Please try again later!!' });
	    }
	    response_body = JSON.parse(apiRes.body);
	    res.status(200).json({ success : true, restaurants: response_body.restaurants });
	});
});

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.listen(process.env.PORT || 5003, function () {
	console.log("Listening on port 5003...");
});