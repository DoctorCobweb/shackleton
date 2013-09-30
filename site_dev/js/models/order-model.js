// site/js/models/order-model.js

define([
    'backbone'
  ],
  function () {
    var Order = Backbone.Model.extend({
      idAttribute: '_id',
 

      initialize: function () {
        console.log('HELLLLLOOO from order-model.js initialize land. Woot.');
      },


      defaults: { 
        cc_number:             'backbone_default',
        cc_cvv:                'backbone_default',
        cc_month:              'backbone_default',
        cc_year:               'backbone_default',
        gig_id:                'backbone_default',
        user_id:               'backbone_default',
        braintree_customer_id: 'backbone_default',
        user_authenticated:    false,
        number_of_tickets:     0,
        ticket_price:          0,
        transaction_amount:    0,
        transaction_id:        'backbone_default',
        transaction_status:    'backbone_default',
        main_event:            'backbone_default',
        event_date:            new Date(),
        venue:                 'backbone_default',
        opening_time:          'backbone_default',
        age_group:             'backbone_default',
        first_name:            'backbone_default',
        last_name:             'backbone_default'
      },

 
      /*
      urlRoot: function () {
        if (this.isNew()) {
          console.log('order model is considered new => _id has no been set');
          console.log('in order-model.js and urlRoot, if, and  is: /api/orders/' 
            + this.id);
          return '/api/orders/the-order';
        } else {
        console.log('in order-model.js and urlRoot, else, and: /api/orders/' + this.id);
        //return '/api/orders' + this._id;
        return '/api/orders/the-order';
        }
      }
      */

    });
  return Order;
  }
);
