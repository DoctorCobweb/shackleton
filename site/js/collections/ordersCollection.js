// site/js/collections/ordersCollection.js

define([
    'backbone',
    'models/order-model'
  ],
  function (Backbone, Order) {
    var Orders  = Backbone.Collection.extend({
      model: Order,
  
      url: '/api/orders/'

    });
    return Orders;
  }
);

