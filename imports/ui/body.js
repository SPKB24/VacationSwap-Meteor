import { Meteor } from 'meteor/meteor';

import { Template } from 'meteor/templating';

import { ReactiveDict } from 'meteor/reactive-dict';

import { Trips } from '../api/trips.js';

import { Route } from './router.js';

import './body.html';
import './homepage.html';
import './dashboard.html';
import './assets/header.html'
import './assets/footer.html'
import './searchresults.html'
import './userprofile.html'
import './trip-edit.html'
import './trip-details.html'
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

Template.header.events({
  'click #newItinerary'(event) {
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
        title: 'My Trip',
        location: '',
        startDate: '',
        picture: '',
        createdAt: new Date(), // current time
        owner: Meteor.userId(),
        days: [
            {
                date: 'Day 1',
                dayTitle: null,
                events: []
            }
        ]
    }, function(err, objectId){
        if (err) return;
        console.log("Trying to do the thing : " + objectId);
        Router.go('/trip/edit/' + objectId);
    });
  },
});

Template.homepage.events({
  'keypress #search_location': function(e) {
    if(e.keyCode ==13) {
      Router.go("/search?custom=" + document.getElementById('search_location').value);
      return false;
    }
  }
});

Template.tripEditLocationBar.rendered = function() {
  console.log("Rendering");
  GoogleMaps.init({
            'key': Meteor.settings.public.googleApiKey,
            'language': 'en',
            'libraries': 'places'
    },
    function () {

      // input = document.getElementById('search_location');
      // autocomplete = new google.maps.places.Autocomplete(input);
      var autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('tripEditSearch')),{types: ['geocode'] }
      );

      console.log("Rendering");

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
        var state = extractFromAdress(place.address_components, "administrative_area_level_1");

        var lat = place.geometry.location.lat();
        var long = place.geometry.location.lng();

        // Create search url
        console.log(town);
        console.log(state);

        document.getElementById('tripEditSearch').value = town + ", " + state;
      });
    }
  );
};

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
        var state = extractFromAdress(place.address_components, "administrative_area_level_1");

        var lat = place.geometry.location.lat();
        var long = place.geometry.location.lng();

        // Create search url
        console.log(town);
        console.log(state);
        Router.go('/search?city=' + town + '&state=' + state);

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


Template.search_page_bar.rendered = function() {
  GoogleMaps.init({
            'key': Meteor.settings.public.googleApiKey,
            'language': 'en',
            'libraries': 'places'
    },
    function () {

      // input = document.getElementById('search_location');
      // autocomplete = new google.maps.places.Autocomplete(input);
      var autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('search_page_top_bar')),{types: ['geocode'] }
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
        var state = extractFromAdress(place.address_components, "administrative_area_level_1");

        var lat = place.geometry.location.lat();
        var long = place.geometry.location.lng();

        // Create search url
        console.log(town);
        console.log(state);
        Router.go('/search?city=' + town + '&state=' + state);
      });
    }
  );
};

Template.search.helpers({
  params() {
    console.log(Router.current().params);
    return town;
  },
});

Template.dashboard.helpers({
  trips() {
    // Show newest trips at the top
    return Trips.find({}, { sort: { createdAt: -1 } });
  }
});

Template.userprofile.events({
  'click .deleteMe'(event) {
    if (confirm("Are you sure?")) {
      Trips.remove(this._id);
    }
  },
  'click .myDetails'(event) {
    event.preventDefault();
    Router.go('/trip/view/' + this._id);
  },
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
        title: 'My Trip',
        location: '',
        startDate: '',
        picture: '',
        createdAt: new Date(), // current time
        owner: Meteor.userId(),
        days: [
            {
                date: 'Day 1',
                dayTitle: null,
                events: []
            }
        ]
    }, function(err, objectId){
        if (err) return;
        console.log("Trying to do the thing : " + objectId);
        Router.go('/trip/edit/' + objectId);
    });

    // Clear form
    // target.text.value = '';
  },
});

Template.userprofile.helpers({
  trips() {
      // Show newest trips at the top
      return Trips.find({ owner : Meteor.userId()}, { sort: { createdAt: -1 } });
  },
  username() {
    return getUserName();
  },
  picture() {
    return getImageUrl();
  },
  hasTrips() {
    return (Trips.find({ owner : Meteor.userId()}).fetch().length > 0);
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
  var service = Meteor.user().services;
  var imageToUse;

  if (service.google) {
    console.log("Is Google Account");
    imageToUse = service.google.picture;
  } else if (service.facebook) {
    console.log("Is Facebook Account");
    imageToUse = "https://graph.facebook.com/" + service.facebook.id + "/picture?type=large";
  } else {
    // Default image incase user isn't using Google or Facebook login
    console.log("Is Email Account");
    imageToUse = "images/default-profile-pic.jpg";
  }

  return "background-image: url('" + imageToUse + "')";
}

// Trip edit JS
Template.tripEdit.onRendered(function(){
    this.state = new ReactiveDict();
    this.state.set('selectedDay', 0);
    $('.collapsible').collapsible();
    $('select').material_select();
});

Template.tripEdit.events({
    'click .editTitle'(event) {
        $('#editTitleModal').openModal();
    },
    'click .editTitleFinished'(event) {
        Trips.update(this._id, {
            $set: {
                title: $('#title').val(),
                location: $('#tripEditSearch').val()
            },
        });
    },
    'click .newDay'(event) {
        //TODO: Create next day with datetime and week day as title if last one has a datetime
        Trips.update(this._id, {
            $push: {
                days:
                {
                    date: 'Day ' + (this.days.length+1),
                    dayTitle: null,
                    events: []
                }
            },
        });
    },
    'click .collapsible-header'(event, instance) {
        instance.state.set('selectedDay', $(event.target).attr('data-daynumber'));
    },
    'click .newEvent'(event, instance) {
        instance.state.set('selectedEvent', false);
        Session.set('selectedEvent',
        {
            title: '',
            notes: '',
            startDate: '',
            startDateTime: '',
            duration: '',
        });
        $('#eventModal').openModal();
    },
    'click a.editEvent'(event, instance) {
        instance.state.set('selectedEvent', $(event.currentTarget).attr('data-eventid'));
        Session.set('selectedEvent', this);
        $('#eventModal').openModal();
    },
    'click .newEventFinished'(event, instance) {
        //Updates event
        if(instance.state.get('selectedEvent')){
            Trips.update(instance.data._id, {
                $set: {
                    ['days.'+instance.state.get('selectedDay')+'.events.'+instance.state.get('selectedEvent')]:
                    {
                        category: $('#eventCategory').val(),
                        title: $('#eventTitle').val(),
                        notes: $('#eventNotes').val(),
                        startDate: $('#eventStartDate').val(),
                        startDateTime: $('#eventStartDateTime').val(),
                        duration: $('#eventDuration').val(),
                    }
                },
            });
        }
        //Inserts Event
        else{
            Trips.update(instance.data._id, {
                $push: {
                    ['days.'+instance.state.get('selectedDay')+'.events']:
                    {
                        category: $('#eventCategory').val(),
                        title: $('#eventTitle').val(),
                        notes: $('#eventNotes').val(),
                        startDate: $('#eventStartDate').val(),
                        startDateTime: $('#eventStartDateTime').val(),
                        duration: $('#eventDuration').val(),
                    }
                },
            });
        }
    },
    'click .deleteEvent'(event, instance) {
        if(instance.state.get('selectedEvent')){
            Trips.update(instance.data._id, {
                $unset: {
                    ['days.'+instance.state.get('selectedDay')+'.events.'+instance.state.get('selectedEvent')]:1
                },
            });
            Trips.update(instance.data._id, {
                $pull: {
                    ['days.'+instance.state.get('selectedDay')+'.events']:null
                },
            });
        }
    }
});

Template.tripEdit.helpers({
  hasLocation: function() {
    var theLocation = Trips.findOne({_id: this._id}).location;
    return (theLocation !== undefined && theLocation !== "");
  }
});

Template.eventEdit.onRendered(function(){
    new Pikaday({ field: $('#startDate')[0] });
    new Pikaday({ field: $('#eventStartDate')[0] });
    Session.set('selectedEventCategory', $('#eventCategory').val());
});

Template.eventEdit.helpers({
    selectedEvent: function() {
        return Session.get('selectedEvent');
    },
    hideTimePriceTags: function() {
        return Session.get('selectedEventCategory') != 'Activity';
    },
});

Template.tripEdit.events({
    'change #eventCategory'(event) {
        console.log('mudou categoria');
        Session.set('selectedEventCategory', $('#eventCategory').val());
    },
});

// Trip Details JS
Template.tripDetail.onRendered(function() {
  $('.collapsible').collapsible();
});

Template.tripDetail.helpers({
  userOwnsTrip() {
    return (Meteor.userId() == Trips.findOne({_id: this._id}).owner);
  },
  hasLocation: function() {
    var theLocation = Trips.findOne({_id: this._id}).location;
    return (theLocation !== undefined && theLocation !== "");
  }
});

Template.tripDetail.events({
  'click .editTrip'(event) {
    Router.go('/trip/edit/' + this._id);
  },
  'click .deleteMe'(event) {
    if (confirm("Are you sure?")) {
      var tripId = this._id;
      Router.go("/userprofile");
      Trips.remove(this._id);
    }
  },
});
