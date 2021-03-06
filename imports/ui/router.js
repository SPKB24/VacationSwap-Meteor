import { Trips } from '../api/trips.js';

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
});

Router.route('/contact', function() {
  this.render('contact');
});

Router.route('/mytrips', function() {
  this.render('dashboard');
});

Router.route('/search', function() {
 this.render('search');
});

Router.route('/userprofile', function() {
 this.render('userprofile');
});

Router.route('/trip/edit/:_id', function () {
    this.render('tripEdit', {
        data: function () {
            return Trips.findOne({_id: this.params._id});
        }
    });
});

Router.route('/trip/view/:_id', function () {
    this.render('tripDetail', {
        data: function () {
            return Trips.findOne({_id: this.params._id});
        }
    });
});
