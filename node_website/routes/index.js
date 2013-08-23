/*
/routes.js  
--------------
*/

module.exports = function(app, models){

app.get('/', function(req, res){
    res.render('index.jade', {});
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

};