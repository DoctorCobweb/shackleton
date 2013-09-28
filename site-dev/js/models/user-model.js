// site/js/models/user-model.js


define([
    'backbone'
  ],
  function () {
    var User= Backbone.Model.extend({
      idAttribute: '_id',

      urlRoot: function () {
        if (this.isNew()) {
          console.log('user model is considered new i.e. thinks id has no been set.');
          console.log('in user-model.js and urlRoot: /api/users/' + this.id);
        }
        console.log('in user-model.js and urlRoot: /api/users/' + this.id);

        return '/api/users/';

      },
 
      defaults: {
        //the id attribute is not id but _id, so dont need the line below
        //id:             'backbone-default-id',

        first_name:            'backbone_default_first_name',
        last_name:             'backbone_default_last_name',
        email_address:         'backbone_default_email_address',
        phone_number:          'backbone_default_phone_number',
        braintree_customer_id: 'backbone_default_braintree_customer_id'
      }
    });
  return User;
  }
);
