// site/js/collections/users_collection.js

define([
    'backbone',
    'models/user-model'
  ],
  function (Backbone, User) {
    var User = Backbone.Collection.extend({
      model: User,
  
      url: '/api/users/'

    });
    return User;
  }
);

