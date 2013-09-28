// site/js/views/user-details-view.js
//the view for a user details to be displayed.

define([
    'backbone',
    'text!tpl/UserDetails.html'
  ], 
  function (Backbone, UserDetailsHTML) {
    var UserDetails = Backbone.View.extend({
      tagName: 'div',
 
      className: 'userDetails',

      template: _.template(UserDetailsHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of user-details-view.js');
        this.current_view = this;
      },

      render: function () {
        console.log('in user-details-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));
  
        return this;
      },
      
      show_view: function (selector, view) {
        console.log('in show_view()');
        if (this.current_view) {
          this.current_view.close();
        }
        $(selector).html(view.render().el);
        this.current_view = view;
        return view;
      }



    });
    return UserDetails;
  }
);
