define(["backbone","text!tpl/AccountView.html","views/account-orders-view","views/account-billing-view","views/account-settings-view","collections/ordersCollection","views/account-billing-default-view","models/user-model","spin"],function(e,t,n,r,i,s,o,u,a){var f=e.View.extend({tagName:"div",className:"account_details",template:_.template(t),events:{"click #account_orders":"orders","click #account_billing":"billing","click #account_settings":"settings","mouseover #account_orders":"select_proceed","mouseout #account_orders":"deselect_proceed","mouseover #account_billing":"select_proceed","mouseout #account_billing":"deselect_proceed","mouseover #account_settings":"select_proceed","mouseout #account_settings":"deselect_proceed"},select_proceed:function(e){this.$("#"+e.currentTarget.id).css("background-color","#1D883B")},deselect_proceed:function(e){this.$("#"+e.currentTarget.id).css("background-color","#2BBB53")},initialize:function(){console.log("in initialize() of account-view.js"),this.BT_DEFAULT_CUS="default_braintree_customer_id",this.spinner_opts={lines:17,length:13,width:4,radius:11,corners:1,rotate:0,direction:-1,color:"#ee680b",speed:1,trail:24,shadow:!1,hwaccel:!1,className:"spinner",zIndex:2e9,top:"0px",left:"auto"}},render:function(){return console.log("in account-view.js and render()"),this.$el.html(this.template()),this},orders:function(){console.log("in orders handler");var e=this;this.orders_collection||(this.orders_collection=new s),this.orders_collection.fetch({success:function(t,r){console.log("SUCCESS in fetching the orders collection"),console.dir(t),console.log(r);if(r.errors){if(!_.isEmpty(r.errors.validation_errors)){console.log("VALIDATION_ERRORS: we have validation errors"),e.render();return}if(!_.isEmpty(r.errors.internal_errors)){console.log("INTERNAL_ERRORS: we have internal errors"),e.render();return}}else{var i=new n({model:t});e.show_view("#account_main",i)}},error:function(e,t){console.log("ERROR in fetching the orders collection"),console.dir(e),console.log(t)}})},billing:function(){console.log("in billing handler");var e=this,t=document.getElementById("account_main"),n=(new a(this.spinner_opts)).spin(t);$.ajax({url:"/api/users/account/billing_info/",type:"GET",success:function(t,i,s){console.log("SUCCESS: got billing info"),console.dir(t),console.log(i),console.dir(s),n.stop();if(t.errors){if(!_.isEmpty(t.errors.validation_errors)){console.log("VALIDATION_ERRORS: we have validation errors"),e.render();return}if(!_.isEmpty(t.errors.internal_errors)){console.log("INTERNAL_ERRORS: we have internal errors");if(t.errors.internal_errors.error!==e.BT_DEFAULT_CUS){console.log("we have other internal errors"),e.render();return}console.log("user has not yet submitted any cc details...");var u=new o;e.show_view("#account_main",u)}}else{var a=new r({billing_data:t});e.show_view("#account_main",a)}},error:function(e,t,r){console.log("ERROR: could not got billing info"),console.dir(e),console.log(t),console.dir(r),n.close()}})},settings:function(){console.log("in settingshandler");var e=this;$.ajax({url:"/api/users/settings/user",type:"GET",success:function(t,n,r){console.log("SUCCESS: got user _id"),console.dir(t),console.log(n),console.dir(r);if(t.errors){console.log("ERROR: could not find user id"),e.render();return}e.user||(e.user=new u({_id:t})),e.user.fetch({success:function(t,n,r){console.log("SUCCESS: got user info"),console.dir(t),console.log(n),console.dir(r);if(n.errors){if(!_.isEmpty(n.errors.validation_errors)){console.log("VALIDATION_ERRORS: there were validation errors"),e.render();return}if(!_.isEmpty(n.errors.internal_errors)){console.log("INTERNAL_ERRORS: there were internal errors"),e.render();return}}else{var s=new i({model:t});e.show_view("#account_main",s)}},error:function(t,n,r){console.log("ERROR: could not get user info"),console.dir(t),console.log(n),console.dir(r),e.render()}})},error:function(e,t,n){console.log("ERROR: could not get user _id"),console.dir(e),console.log(t),console.dir(n)}})},show_view:function(e,t){return console.log("in show_view, and this.current_view is: "),console.log(this.current_view),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t}});return f});