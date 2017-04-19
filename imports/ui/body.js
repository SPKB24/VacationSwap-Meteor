import { Meteor } from 'meteor/meteor';

import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';

import { Route } from './router.js';

import './body.html';
import './homepage.html';
import './dashboard.html';
import './assets/header.html'
import './assets/footer.html'
import './searchresults.html'
import './userprofile.html'
import './about.html'
import './contact.html'

Meteor.autorun(function () {
  if (Meteor.userId()) {
    //   $('.button-collapse').sideNav('show');
      console.log('logged in');
  } else {
    //do something when logged out
    // $('.button-collapse').sideNav('hide');
  }
});

Template.homepage.rendered = function() {
  window.onload = function() {
    input = document.getElementById('search_location');
    autocomplete = new google.maps.places.Autocomplete(input);

    // When the user selects an address from the dropdown,
    google.maps.event.addListener(autocomplete, 'place_changed', function() {

       // Get the place details from the autocomplete object.
       var place = autocomplete.getPlace();

       console.log("place: " + JSON.stringify(place) );
    });
  };
}

Template.dashboard.helpers({
  trips() {
      // Show newest trips at the top
      return Trips.find({}, { sort: { createdAt: -1 } });
  },
});

Template.userprofile.helpers({
  trips() {
      // Show newest trips at the top
      return Trips.find({}, { sort: { createdAt: -1 } });
  },
});

Template.dashboard.events({
  'click .new-trip'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    // const target = event.target;
    // const text = target.text.value;

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // Insert a task into the collection
    Trips.insert({
      title: 'My Trip 2017',
      createdAt: new Date(), // current time
      owner: Meteor.userId()
    });

    // Clear form
    // target.text.value = '';
  },
});

Template.userprofile.helpers({
  username() {
    return getUserName();
  },
  picture() {
    return getImageUrl();
  }
});

// To get profile pic
// https://graph.facebook.com/$(UID)/picture
//
//

// Get the username, regardless of if they signed in
// using email, Google, or Facebook.
function getUserName() {
  var username;
  try {
    username = Meteor.user().profile.name;
  } catch (TypeError) {
    try {
      username = Meteor.user().emails[0].address;
    } catch (TypeError) {
      username = "Friendly user!";
    }
  }
  return username;
}

// Try and get profile pic, otherwise use default image
function getImageUrl() {
  // return "http://4.bp.blogspot.com/-zsbDeAUd8aY/US7F0ta5d9I/AAAAAAAAEKY/UL2AAhHj6J8/s1600/facebook-default-no-profile-pic.jpg";
  // return "https://graph.facebook.com/10206946227812450/picture?type=large"
  return "https://graph.facebook.com/100002248789806/picture?type=large"
}
