/*
/routes.js  
--------------
*/

module.exports = function(app, express){

app.get('/', function(req, res){
    res.render('index.jade', {});
});

app.get('/features', function(req, res){
  res.render('features', {});
});

app.get('/about', function(req, res){
  res.render('about', {});
});

app.get('/contact', function(req, res){
  res.render('contact', {});
});

app.get('/faq', function(req, res){
  res.render('faq', {});
});

app.get('/news', function(req, res){
  res.render('news', {});
});

app.get('/careers', function(req, res){
  res.render('careers', {});
});

app.get('/terms', function(req,res) {
  res.render('terms', {});
});

app.get('/commercialuse', function(req,res) {
	res.render('commercialuse', {});
});

app.get('/acceptableuse', function(req,res) {
	res.render('acceptableuse', {});
});

app.get('/pricingterms', function(req,res) {
	res.render('pricingterms', {});
});

app.get('/security', function(req,res) {
	res.render('security', {});
});

app.get('/privacy', function(req,res) {
	res.render('privacy', {});
});

app.get('/signup', function(req,res) {
	res.render('signup', {});
});

app.get('/loginuser', function(req,res) {
	res.render('login', {});
});

app.get('/thanks', function(req,res) {
  res.render('thanks', {});
});

app.get('/admin', function(req,res) {
  res.render('loginAdmin', {});
});

};