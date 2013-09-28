// site/js/views/order-detail-view.js

//the view for an actual order to be displayed.

define([
    'backbone',
    'text!tpl/OrderDetailsView.html',
  ], 
  function (Backbone, OrderDetailsViewHTML)
  {

    var Order = Backbone.View.extend({
      tagName: 'div',

      className: 'order_details',

      template: _.template(OrderDetailsViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of order-detail-view.js');
      },

      render: function () {
        console.log('in order-detail-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));
        
        console.log('this.model: ');
        console.dir(this.model);

        this.currentView = this;
        return this;
      },


      showView: function (selector, view) {
        console.log('in showView in order-detail-view.js');
        if (this.currentView) {
          this.currentView.close();
        }
        $(selector).html(view.render().el);
        this.currentView = view;
        return view; 
      } 

    });
    return Order;
  }
);
