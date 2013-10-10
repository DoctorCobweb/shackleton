define(["backbone","text!tpl/NumberOfTicketsView.html","models/order-model","collections/ordersCollection","views/credit-card-details-view","views/checkout-view","views/purchase-with-credit-card-from-vault-view","text!tpl/NegativeUserFeedback.html"],function(e,t,n,r,i,s,o,u){var a=e.View.extend({tagName:"div",className:"view_number_of_tickets",template:_.template(t),events:{"click #ticket_amount_one":"one_ticket","click #ticket_amount_two":"two_tickets","click #ticket_amount_three":"three_tickets","click #ticket_amount_four":"four_tickets","click #ticket_amount_five":"five_tickets","click #ticket_amount_six":"six_tickets","click #ticket_amount_seven":"seven_tickets","click #ticket_amount_eight":"eight_tickets","click #submit":"submit"},initialize:function(){console.log("in initialize() of number-of-tickets-view.js"),console.log("this.model: "+JSON.stringify(this.model)),this.number_of_tickets=0,this.total_amount=0,this.tmp_model={},console.log("this.options");for(var e in this.options)console.log(this.options[e])},render:function(){return console.log("in number-of-tickets-view.js and render()"),this.$el.html(this.template(this.model.toJSON())),this.current_view=this,this},one_ticket:function(){this.number_of_tickets=1,this.calculate_total_and_display()},two_tickets:function(){this.number_of_tickets=2,this.calculate_total_and_display()},three_tickets:function(){this.number_of_tickets=3,this.calculate_total_and_display()},four_tickets:function(){this.number_of_tickets=4,this.calculate_total_and_display()},five_tickets:function(){this.number_of_tickets=5,this.calculate_total_and_display()},six_tickets:function(){this.number_of_tickets=6,this.calculate_total_and_display()},seven_tickets:function(){this.number_of_tickets=7,this.calculate_total_and_display()},eight_tickets:function(){this.number_of_tickets=8,this.calculate_total_and_display()},calculate_total_and_display:function(){this.total_amount=this.number_of_tickets*this.model.get("price"),this.model.set({number_of_tickets:self.number_of_tickets}),console.log("Total price for "+this.number_of_tickets+" is: "+this.total_amount),this.$("#total_amount").html(this.total_amount);return},submit:function(){console.log("clicked proceed to payment button");var e=this;if(!e.number_of_tickets){console.log("ERROR: no tickets have been selected"),this.$("#number_of_tickets").prepend(_.template(u)({error:"No tickets selected"}));return}this.new_order||(this.new_order=new n),this.new_order.set({gig_id:e.model.get("_id"),ticket_price:e.model.get("price"),number_of_tickets:e.number_of_tickets,transaction_amount:e.total_amount}),this.orders_collection||(this.orders_collection=new r),this.orders_collection.add(this.new_order),this.new_order.save({},{success:function(t,n){console.log("SUCCESS: saved the new_order for the first time."),console.dir(t),console.dir(n);if(n.error)console.log("response.first_time_purchaser returned NOT as expected"),alert("ERROR: "+n.error),console.log(e.new_order),e.render();else if(n.braintree_customer_id==="default_braintree_customer_id"){console.dir(e.new_order);var r=new i({model:e.new_order});e.show_view("#featureContent",r),window.scrollTo(0,350)}else if(n.braintree_customer_id!=="default_braintree_customer_id"){var s=new o({model:e.new_order});e.show_view("#featureContent",s),window.scrollTo(0,350)}else console.log("hit the bottom of if logic, uh oh"),e.render()},error:function(t,n){console.log("ERROR: could not save the new_order for the first time."),console.dir(t),console.dir(n),alert("ERROR: could not save the new_order model."),e.render()}})},show_view:function(e,t){return console.log("in showView of number-of-tickets-view.js"),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t}});return a});