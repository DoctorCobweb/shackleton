//site/js/views/account-orders-view.js

// the collection of order models is called  'Orders'

define([
    'backbone',
    'views/order-list-item-view',
    'collections/ordersCollection',
    //'views/gig-guide-landing-view'
  ], 
  function (Backbone, OrderListItemView, Orders) {

    OrdersView = Backbone.View.extend({
      tagName: 'ul',

      //el: '#featureList',
     
      //className: 'thumbnails',
   
      events: {},

      initialize: function () {
        console.log('in intialize in account-orders-view.js');

      },

      render: function () {
        console.log('in render() of account-orders-view.js');


        // render the OrdersView by rendering each order in collection
        _.each(this.model.models, function (item) {
          this.render_order_list_item(item);
        }, this);

        return this;
      },

      render_order_list_item: function (item) {
        console.log('in render_order_list_item() of account-orders-view.js');

        // instantiate a new order 
        var orderListItemView = new OrderListItemView({model: item});
    
        // call its render function, append its element to OrdersView element, el
        this.$el.append(orderListItemView.render().el);
      }


    });
    return OrdersView;
  }
);
