Router.route('/', function() {
  this.render('homepage');
});

Router.route('/about', function() {
  this.render('about');
});

Router.route('/contact', function() {
  this.render('contact');
});
