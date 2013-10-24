define(["backbone","braintree","text!tpl/PurchaseWithCreditCardFromVaultView.html","views/checkout-view","views/credit-card-details-view","text!tpl/SuccessfulUserFeedback.html","cookie_util","text!tpl/NegativeUserFeedback.html","spin"],function(e,t,n,r,i,s,o,u,a){var f=e.View.extend({tagName:"div",className:"view_purchase_with_cc_from_vault_details",template:_.template(n),events:{"keypress #cc_number":"cc_number_update","keypress #cc_cvv":"cc_cvv_update","keypress #cc_month":"cc_month_update","keypress #cc_year":"cc_year_update","blur #cc_number":"cc_number_blur","blur #cc_cvv":"cc_cvv_blur","blur #cc_month":"cc_month_blur","blur #cc_year":"cc_year_blur","click #submit":"submit","click #during_checkout_edit_cc_details":"edit_cc_details","click #submit_updated_cc":"submit_updated_cc","mouseover #submit":"select_proceed","mouseout #submit":"deselect_proceed","mouseover #during_checkout_edit_cc_details":"select_proceed","mouseout #during_checkout_edit_cc_details":"deselect_proceed","mouseover #submit_updated_cc":"select_proceed","mouseout #submit_updated_cc":"deselect_proceed","click #cancel_update_cc":"cancel_update_cc"},select_proceed:function(e){this.$("#"+e.currentTarget.id).css("background-color","#1D883B")},deselect_proceed:function(e){this.$("#"+e.currentTarget.id).css("background-color","#2BBB53")},initialize:function(){console.log("in initialize() of purchase-with-credit-card-from-vault-view.js"),this.current_view=this,this.new_cc_details={},_.bindAll(this),this.braintree=t.create("MIIBCgKCAQEAwJo0HGLwcnHbj+LCBWEvxjjfZYTwoJuNvR34CevWwu71HeQ7s6kD9FuzK3nHFL0oA2/HchnhmWh4ilFzYq3/4U+hNLJwdG++MlZxQ9KlfLX2ROatmuOyIcD1mXKlKAEhuxU4OnTBnMByyzhy3Hz/9omOGWK0bjmSKkZabjwiqgs0E2VLeRaTERxWPPAKEPgKfiFjiYdOyYbXvvOtRU6kMze6ZoYnF098/RkrJuL8a+tn6otmQHJOvvLobJf0PYTH1YKEgx7JGhTQ0tvewd/gz4Lg8GMknM0HkGWaqtpLzeqahDGfik0PZQfWArvVQofOLVito0yY1Ck6G2A8mrjb/QIDAQAB"),console.log("braintree object:"),console.dir(this.braintree),this.spinner_opts={lines:11,length:13,width:4,radius:11,corners:1,rotate:0,direction:-1,color:["rgb(255, 255, 0)","rgb(255, 165, 0)","rgb(255, 69,  0)"],speed:1,trail:24,shadow:!1,hwaccel:!1,className:"spinner",zIndex:2e9,top:"auto",left:"auto"}},render:function(){console.log("in purchase-with-credit-card-from-vault-view.js and render()"),console.log("this.model:"),console.dir(this.model),this.$el.html(this.template(this.model.toJSON()));var e=this.model.get("number_of_tickets")*this.model.get("ticket_price");return this.$("#summary_total_amount").html(e),this.$cc_number=this.$("#cc_number"),this.$cc_cvv=this.$("#cc_cvv"),this.$cc_month=this.$("#cc_month"),this.$cc_year=this.$("#cc_year"),this.get_billing_info(),this},get_billing_info:function(){var e=document.getElementById("vault_cc"),t=(new a(this.spinner_opts)).spin(e);$.ajax({url:"/api/users/account/billing_info/",type:"GET",success:function(e,n,r){console.log("SUCCESS: user cc details: "),console.dir(e),console.log(n),console.dir(r),t.stop(),self.$("#cc_masked_number").html(e.masked_number),self.$("#cc_expiration_date").html(e.expiration_date)},error:function(e,n,r){console.log("ERROR: user cc details: "),console.dir(e),console.log(n),console.dir(r),t.stop()}})},cc_number_update:function(e){console.log("cc_number");return},cc_cvv_update:function(e){console.log("cc_cvv");return},cc_month_update:function(e){console.log("cc_month");return},cc_year_update:function(e){console.log("cc_year");return},cc_number_blur:function(e){console.log("cc_number_blur"),this.close_input_field(this.$cc_number,"cc_number");return},cc_cvv_blur:function(e){console.log("cc_cvv_blur"),this.close_input_field(this.$cc_cvv,"cc_cvv");return},cc_month_blur:function(e){console.log("cc_month_blur"),this.close_input_field(this.$cc_month,"cc_month");return},cc_year_blur:function(e){console.log("cc_year_blur"),this.close_input_field(this.$cc_year,"cc_year");return},close_input_field:function(e,t){console.log("close_input_field()"),console.dir(e),console.log("model_attribute: "+t);var n={},r=e.val().trim(),i=this.braintree.encrypt(r);n[t]=i,this.model.set(n),this.new_cc_details[t]=i,console.log("value entered into field, "+t+" is "+r),console.log("encrpyted value of entered into field, "+t+" is "+i);return},submit:function(){console.log("submitting cc details"),console.log("this.model: "),console.dir(this.model);var e=document.getElementById("featureContent"),t=(new a(this.spinner_opts)).spin(e),n=this;if(!o.get("reserve_tickets")){alert("TICKET RESERVATION EXPIRED: Please start again.");return}this.model.save({},{error:function(e,r){console.log("ERROR in ajax call to save/update the model/order"),console.dir(e),console.dir(r),t.stop(),n.render()},success:function(e,r){console.log("SUCCESS in ajax call to save/update the model/order"),console.dir(e),console.dir(r),t.stop();if(r.errors){console.log("ERRORS: we have errors in processing the order");if(!_.isEmpty(r.errors.validation_errors)){console.log("VALIDATION_ERROR: data posted created validation errors"),n.render();return}if(!_.isEmpty(r.errors.internal_errors)){console.log("INTERNAL_ERROR: data posted created internal errors"),alert("ERROR: there was a problem submitting your order: "+r.errors.internal_errors.error),n.render();return}return}n.handle_cc_statuses(r,e)}})},handle_cc_statuses:function(t,n){var i=t.transaction_status;if(i==="submitted_for_settlement"){console.log("transaction_status: "+i),e.trigger("order:finished"),clearInterval(this.interval_id);var s=new r({model:n});this.show_view("#featureContent",s),window.scrollTo(0,350)}else i==="authorized"?(console.log("transaction_status: "+i),this.render()):(console.log("transaction_status: "+i),this.render())},edit_cc_details:function(){this.$("#submit").css("display","none"),this.$("#during_checkout_update_cc_details").css("display","block"),this.$("#vault_cc").css("display","none")},cancel_update_cc:function(){this.$("#submit").css("display","block"),this.$("#during_checkout_update_cc_details").css("display","none"),this.$("#vault_cc").css("display","block")},submit_updated_cc:function(){console.log("you just clicked submit_updated_cc div");var e=document.getElementById("during_checkout_update_cc_details"),t=(new a(this.spinner_opts)).spin(e),n=this.$("#vault_cc > .successful_user_feedback"),r=this.$("#vault_cc > .negative_user_feedback");n.css("display")==="block"&&n.css("display","none"),r.css("display")==="block"&&r.css("display","none");var i=this;$.ajax({url:"/api/users/change_cc_details/",type:"POST",data:i.new_cc_details,success:function(e,n,r){console.log("SUCCESS: changed the cc details for the user"),console.dir(e),console.log(n),console.dir(r),t.stop();if(!e.success){i.render(),i.$("#vault_cc").prepend(_.template(u)({error:"could not change credit card. Try again."}));return}i.$("#vault_cc").css("display","block"),i.$("#cc_masked_number").html(e.result.masked_number),i.$("#cc_expiration_date").html(e.result.expiration_date),i.$("#during_checkout_update_cc_details").css("display","none"),i.$("#submit").css("display","block"),i.$("#vault_cc").prepend(_.template(s)({success:"Updated credit card"}))},error:function(e,n,r){console.log("ERROR: could not change the cc details for the user"),console.dir(e),console.log(n),console.dir(r),t.stop()}})},show_view:function(e,t){return console.log("in showView of credit-card-details-view.js"),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t}});return f});