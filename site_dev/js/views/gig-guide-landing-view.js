// site/js/views/gig-guide-landing-view.js

// the default landing view for when a user clicks on the gig guide tab in nav bar
// but hasnt yet selected a gig

define([
    'backbone',
    'text!tpl/GigGuideLandingView.html'
  ],
  function (Backbone, GigGuideLandingHTML) {
    var GigGuideLandingView = Backbone.View.extend({
      tagName: 'div',

      className: 'gigDetails',

      template: _.template(GigGuideLandingHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of gig-guide-landing-view.js');
       
        this.on('close-default-landing-page', 
          function () {
            console.log('HELLO FROM gig-guide-landing-view.js');
          });     
 
      },

      render: function () {
        console.log('in gig-guide-landing-view.js and render()');

        this.$el.html(this.template());

        //console.log('this is = ' + JSON.stringify(this));
        //console.log('this.el is = ' + this.el);
        //console.log('this.attributes is = ' + this.attributes);
        return this;
      }
    });
    return GigGuideLandingView;
  }
);
