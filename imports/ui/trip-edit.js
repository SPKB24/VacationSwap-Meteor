import { Trips } from '../api/trips.js';

import './trip-edit.html';

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
                startDate: $('#startDate').val()
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
