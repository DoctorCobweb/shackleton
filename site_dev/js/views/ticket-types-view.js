// site/js/views/ticket-types-view.js


define([
    'backbone',
    'text!tpl/TicketTypesView.html'
  ],
  function (Backbone, TicketTypesViewHTML) {
    var TicketTypesView  = Backbone.View.extend({
      tagName: 'div',

      className: 'ticket_types_details',

      template: _.template(TicketTypesViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of ticket-types-view.js');
      },

      render: function () {
        console.log('in ticket-types-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return TicketTypesView;
  }
);
