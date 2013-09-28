// site/js/views/contact-view.js


define([
    'backbone',
    'text!tpl/ContactView.html'
  ],
  function (Backbone, ContactViewHTML) {
    var ContactView = Backbone.View.extend({
      tagName: 'div',

      className: 'contact_details',

      template: _.template(ContactViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of contact-view.js');
      },

      render: function () {
        console.log('in contact-view.js and render()');

        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());

        return this;
      }
    });
    return ContactView;
  }
);
