var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'postservice'
});
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('index', null);
});
router.get('/find', function(req, res, next) {
		res.render('find', { title: 0, id:'' });
});
router.get('/wheregive', function(req, res, next) {
		connection.query('select address, city, country, postcode from servicepoints;', function(err, rows){
			res.render('wheregive', { servicepoints:rows});
		});
		
});
router.post('/find', function(req, res, next) {
		connection.query('select status, currentdate, servicepoints.address as spAddress, servicepoints.city as spCity, servicepoints.country as spCountry, payment.price as payPrice, courier.telnumber as couNum, sender.firstname as senFirstName, sender.lastname as senLastName, sender.address as senAddress, sender.city as senCity, sender.country as senCountry, sender.postcode as senPostCode, sender.telnumber as senNum, receiver.firstname as recFirstName, receiver.lastname recLastName, receiver.address recAddress, receiver.city as recCity, receiver.country as recCountry, receiver.postcode as recPostCode, receiver.telnumber as recNum from shipping join servicepoints on cityplace=servicepoints.id join payment on shipping.paymentid=payment.typeid join courier on shipping.courierid=courier.pesel join sender on shipping.senderid=sender.id join receiver on shipping.receiverid=receiver.id where shipping.id='+req.body.wprowadzId+';', function (err, rows){		
			res.render('find', {title: 1, shipping:rows, id: req.body.wprowadzId});
		});	
});
router.post('/wheregive', function(req, res, next) {
		connection.query('select address, city, country, postcode from servicepoints order by '+req.body.sort+';', function(err, rows){
			res.render('wheregive', { servicepoints:rows});
		});
});
router.get('/prices', function(req, res, next) {
		connection.query('select shippingtype, min(price) as min, max(price) as max from shippingtype join payment on payment.id=shippingtype.id group by shippingtype;', function(err,rows){
			res.render('prices', {value:rows});
		});
});
module.exports = router;
