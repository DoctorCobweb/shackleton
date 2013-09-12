// site/js/models/gig-model.js


define([
    'backbone'
  ],
  function () {
    var Gig = Backbone.Model.extend({
      idAttribute: '_id',
 
      defaults: {
        mainEvent: 'No title',
        eventDate: 'TBC',
        openingTime: '8:00 pm',
        venue: 'TBC',
        price: 'TBC',
        supports: 'Not supplied',
        ageGroup: 'TBC',
        description: 'No description supplied.',
        tagNames: 'No tags supplied',
        imageUrl: "http://d11x7re0mdurt0.cloudfront.net/img/placekitten_400x300.jpg"
      }
    });
    return Gig;
  }
);
