define(["backbone","views/order-list-item-view","collections/ordersCollection"],function(e,t,n){return OrdersView=e.View.extend({tagName:"ul",className:"view_account_orders_details",events:{},initialize:function(){console.log("in intialize in account-orders-view.js")},render:function(){return console.log("in render() of account-orders-view.js"),console.log("this.model: "),console.dir(this.model),console.log("this.model.models: "+this.model.models),console.log("this.model.models.length: "+this.model.models.length),this.model.models.length?_.each(this.model.models,function(e){this.render_order_list_item(e)},this):(console.log("the user has no orders yet saved/purchased."),this.$el.html("<li>You have no orders yet</li>")),this},render_order_list_item:function(e){console.log("in render_order_list_item() of account-orders-view.js");var n=new t({model:e});this.$el.append(n.render().el)}}),OrdersView});