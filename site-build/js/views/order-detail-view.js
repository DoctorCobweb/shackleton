define(["backbone","text!tpl/OrderDetailsView.html"],function(e,t){var n=e.View.extend({tagName:"div",className:"order_details",template:_.template(t),events:{},initialize:function(){console.log("in initialize() of order-detail-view.js")},render:function(){return console.log("in order-detail-view.js and render()"),this.$el.html(this.template(this.model.toJSON())),console.log("this.model: "),console.dir(this.model),this.currentView=this,this},showView:function(e,t){return console.log("in showView in order-detail-view.js"),this.currentView&&this.currentView.close(),$(e).html(t.render().el),this.currentView=t,t}});return n});