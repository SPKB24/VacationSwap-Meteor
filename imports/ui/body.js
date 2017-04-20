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

Template.googleSearchBar.rendered = function() {
  GoogleMaps.init({
            'key': Meteor.settings.public.googleApiKey,
            'language': 'en',
            'libraries': 'places'
    },
    function () {
      // input = document.getElementById('search_location');
      // autocomplete = new google.maps.places.Autocomplete(input);
      var autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('search_location')),{types: ['geocode'] }
      );

      // When the user selects an address from the dropdown,
      google.maps.event.addListener(autocomplete, 'place_changed', function() {

        // Get the place details from the autocomplete object.
        const place = autocomplete.getPlace();

        console.log(place);

        function extractFromAdress(components, type){
          for (var i=0; i<components.length; i++)
              for (var j=0; j<components[i].types.length; j++)
                  if (components[i].types[j]==type) return components[i].long_name;
          return "";
        }

        // Optional code for getting address info
        var postCode = extractFromAdress(place.address_components, "postal_code");
        var street = extractFromAdress(place.address_components, "route");
        var town = extractFromAdress(place.address_components, "locality");
        var country = extractFromAdress(place.address_components, "country");

        var lat = place.geometry.location.lat();
        var long = place.geometry.location.lng();
        // console.log(lat);
        // console.log(long);

        var buildPlaceSearch = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
        "location=" + lat + "," + long + "&radius=500&&" +
        "key=AIzaSyCO9_fZmjH5p9XEs43MA_NG4ZEnicbRGHM";

        // Need to use crossorigin to fix the "No Access-Control-Allow-Origin header
        // is present on the requested resource" shit error
        var testo = "https://crossorigin.me/" + buildPlaceSearch;
        var photoReference;
        var photoReferenceID;

        $.getJSON(testo, function(data) {
          // console.log(data);
          photoReference = data;
          photoReferenceID = photoReference.results[0].photos[0].photo_reference;
          console.log(photoReferenceID);
          var photoLink = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photoReferenceID
          + "&key=AIzaSyCO9_fZmjH5p9XEs43MA_NG4ZEnicbRGHM"
          // Actual link to photo
          console.log(photoLink);
        });
      });
    }
  );
};

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
