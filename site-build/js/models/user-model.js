define(["backbone"],function(){var e=Backbone.Model.extend({idAttribute:"_id",urlRoot:function(){return this.isNew()&&(console.log("user model is considered new i.e. thinks id has no been set."),console.log("in user-model.js and urlRoot: /api/users/"+this.id)),console.log("in user-model.js and urlRoot: /api/users/"+this.id),"/api/users/"},defaults:{first_name:"backbone_default_first_name",last_name:"backbone_default_last_name",email_address:"backbone_default_email_address",phone_number:"backbone_default_phone_number",braintree_customer_id:"backbone_default_braintree_customer_id"}});return e});