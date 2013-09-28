// site/js/collections/gigGuide.js

define([
    'backbone',
    'models/gig-model'
  ],
  function (Backbone, Gig) {
    var GigGuide = Backbone.Collection.extend({
      model: Gig,
  
      url: '/api/gigs'

    });
    return GigGuide;
  }
);

