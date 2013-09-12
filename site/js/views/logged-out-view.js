// site/js/views/logged-out-view.js

//the logded out view to be displayed.

define([
    'backbone',
    'text!tpl/LoggedOutView.html'
  ], 
  function (Backbone, LoggedOutHTML) {
    var LoggedOutView = Backbone.View.extend({
      tagName: 'div',

      className: 'logged_out_details',

      template: _.template(LoggedOutHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of logged-out-view.js');
      },

      render: function () {
        console.log('in logged-out-view.js and render()');

        this.$el.html(this.template());
  
        return this;
      }
    });
    return LoggedOutView;

  }
);
