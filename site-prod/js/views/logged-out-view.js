define(["backbone","text!tpl/LoggedOutView.html"],function(e,t){var n=e.View.extend({tagName:"div",className:"logged_out_details",template:_.template(t),events:{},initialize:function(){console.log("in initialize() of logged-out-view.js")},render:function(){return console.log("in logged-out-view.js and render()"),this.$el.html(this.template()),this}});return n});