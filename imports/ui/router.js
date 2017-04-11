// Router.onRun(function(){
//   console.log('onRun', this.current().route.getName());
//   this.next();
// });
//
// Router.onBeforeAction(function(){
//   console.log('onBeforeAction', this.current().route.getName());
//   this.next();
// });

// Router.route('/list/:_id', {
//   name: 'homepage',
//   template: 'homepage',
//   data: function() {
//
//     this.next();
//   }
// })

Router.route('/', function() {
  this.render('homepage');
});

Router.route('/about', function() {
  this.render('about');
  Session.set('currentPage', Router.current().router.getName());
});

Router.route('/contact', function() {
  this.render('contact');
  Session.set('currentPage', Router.current().router.getName());
});

Router.route('/mytrips', function() {
  this.render('dashboard');
  Session.set('currentPage', Router.current().router.getName());
});
