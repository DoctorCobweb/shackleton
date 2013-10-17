define(["backbone","text!tpl/AccountBilling.html","braintree","text!tpl/SuccessfulUserFeedback.html"],function(e,t,n,r){var i=e.View.extend({tagName:"div",className:"view_account_billing_details",template:_.template(t),events:{"keypress #cc_number":"cc_number_update","keypress #cc_cvv":"cc_cvv_update","keypress #cc_month":"cc_month_update","keypress #cc_year":"cc_year_update","blur #cc_number":"cc_number_blur","blur #cc_cvv":"cc_cvv_blur","blur #cc_month":"cc_month_blur","blur #cc_year":"cc_year_blur","click #account_change_cc":"change_cc","click #submit_new_cc":"submit","mouseover #account_change_cc":"select_proceed","mouseout #account_change_cc":"deselect_proceed","mouseover #submit_new_cc":"select_proceed","mouseout #submit_new_cc":"deselect_proceed"},select_proceed:function(e){this.$("#"+e.currentTarget.id).css("background-color","#1D883B")},deselect_proceed:function(e){this.$("#"+e.currentTarget.id).css("background-color","#2BBB53")},initialize:function(){console.log("in initialize() of account-billing-view.js"),this.current_view=this,console.log("options:"),console.dir(this.options),this.braintree=n.create("MIIBCgKCAQEAwJo0HGLwcnHbj+LCBWEvxjjfZYTwoJuNvR34CevWwu71HeQ7s6kD9FuzK3nHFL0oA2/HchnhmWh4ilFzYq3/4U+hNLJwdG++MlZxQ9KlfLX2ROatmuOyIcD1mXKlKAEhuxU4OnTBnMByyzhy3Hz/9omOGWK0bjmSKkZabjwiqgs0E2VLeRaTERxWPPAKEPgKfiFjiYdOyYbXvvOtRU6kMze6ZoYnF098/RkrJuL8a+tn6otmQHJOvvLobJf0PYTH1YKEgx7JGhTQ0tvewd/gz4Lg8GMknM0HkGWaqtpLzeqahDGfik0PZQfWArvVQofOLVito0yY1Ck6G2A8mrjb/QIDAQAB"),console.log("braintree object"),console.dir(this.braintree),this.field_to_set={},this.ENTER_KEY=13},render:function(){return console.log("in account-billing-view.js and render()"),this.$el.html(this.template(this.options.billing_data)),this.$cc_number=this.$("#cc_number"),this.$cc_cvv=this.$("#cc_cvv"),this.$cc_month=this.$("#cc_month"),this.$cc_year=this.$("#cc_year"),this},re_render:function(e){return console.log("in account-billing-view.js and re_render()"),this.$el.html(this.template(e)),this.$cc_number=this.$("#cc_number"),this.$cc_cvv=this.$("#cc_cvv"),this.$cc_month=this.$("#cc_month"),this.$cc_year=this.$("#cc_year"),this},cc_number_update:function(e){console.log("cc_number");return},cc_cvv_update:function(e){console.log("cc_cvv");return},cc_month_update:function(e){console.log("cc_month");return},cc_year_update:function(e){console.log("cc_year"),e.which===this.ENTER_KEY&&(this.close_input_field(this.$cc_year,"cc_year"),this.submit());return},cc_number_blur:function(e){console.log("cc_number_blur"),this.close_input_field(this.$cc_number,"cc_number");return},cc_cvv_blur:function(e){console.log("cc_cvv_blur"),this.close_input_field(this.$cc_cvv,"cc_cvv");return},cc_month_blur:function(e){console.log("cc_month_blur"),this.close_input_field(this.$cc_month,"cc_month");return},cc_year_blur:function(e){console.log("cc_year_blur"),this.close_input_field(this.$cc_year,"cc_year");return},close_input_field:function(e,t){console.log("close_input_field()"),console.dir(e),console.log("model_attribute: "+t);var n=e.val().trim(),r=this.braintree.encrypt(n);this.field_to_set[t]=r,console.log("value entered into field, "+t+" is "+n),console.log("encrpyted value of entered into field, "+t+" is "+r);return},change_cc:function(){console.log("change_cc handler"),this.$("#account_billing_change_cc").css("display","none"),this.$("#account_billing_update_cc_details").css("display","block");var e=self.$("#account_billing_credit_card > .successful_user_feedback");e.css("display")=="block"&&e.css("display","none")},submit:function(){var e=this;$.ajax({url:"/api/users/change_cc_details/",type:"POST",data:e.field_to_set,success:function(t,n,i){console.log("SUCCESS: submitted the cc to braintree"),console.dir(t),console.log(n),console.dir(i);var s=e.$(".form-group");s.hasClass("has-error")&&s.removeClass("has-error");var o=e.$("#account_billing_credit_card > .successful_user_feedback");o.css("display")=="block"&&o.css("display","none");if(t.success===!1){if(!_.isEmpty(t.errors.validation_errors)){console.log("VALIDATION ERRORS");for(var u in t.errors.validation_errors){var a="#"+t.errors.validation_errors[u].param;console.log(a),$(a).parent(".form-group").addClass("has-error")}return}if(!_.isEmpty(t.errors.internal_errors)){console.log("INTERNAL ERRORS"),e.render();return}if(!_.isEmpty(t.errors.braintree_errors)){console.log("BRAINTREE ERRORS"),console.dir(t.errors.braintree_errors),e.render();return}}else{console.log("SUCCESSFUL CC DETAILS UPDATE"),e.$("#account_billing_update_cc_details").css("display","none");var f={};f.masked_number=t.result.masked_number,f.last_4=t.result.last_4,f.expiration_date=t.result.expiration_date,e.re_render(f),e.$("#account_billing_credit_card").prepend(_.template(r)({success:"Updated billing details"})),window.scrollTo(0,350)}},error:function(t,n,r){console.log("ERROR: failed setting the braintree cc in vault"),console.dir(t),console.log(n),console.dir(r),e.render()}})},show_view:function(e,t){return console.log("in show_view()"),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t}});return i});