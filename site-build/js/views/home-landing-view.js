define(["backbone","text!tpl/HomeLandingView.html"],function(e,t){var n=e.View.extend({tagName:"div",className:"home_landing_details",template:_.template(t),events:{},initialize:function(){console.log("in initialize() of home-landing-view.js")},render:function(){return console.log("in home -landing-view.js and render()"),this.$el.html(this.template()),this}});return n});