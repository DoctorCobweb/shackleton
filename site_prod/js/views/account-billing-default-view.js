define(["backbone","text!tpl/AccountBillingDefault.html","braintree","views/account-billing-view","text!tpl/SuccessfulUserFeedback.html"],function(e,t,n,r,i){var s=e.View.extend({tagName:"div",className:"account_billing_default_details",template:_.template(t),events:{"keypress #cc_number":"cc_number_update","keypress #cc_cvv":"cc_cvv_update","keypress #cc_month":"cc_month_update","keypress #cc_year":"cc_year_update","blur #cc_number":"cc_number_blur","blur #cc_cvv":"cc_cvv_blur","blur #cc_month":"cc_month_blur","blur #cc_year":"cc_year_blur","click #submit":"submit","mouseover #submit":"select_proceed","mouseout #submit":"deselect_proceed"},select_proceed:function(e){console.log("in select_proceed"),console.dir(e),console.log("select_proceed, e.currentTarget.id: "+e.currentTarget.id),this.$("#"+e.currentTarget.id).css("background-color","#1D883B")},deselect_proceed:function(e){console.log("in deselect_proceed"),console.dir(e),console.log("deselect_proceed, e.currentTarget.id: "+e.currentTarget.id),this.$("#"+e.currentTarget.id).css("background-color","#2BBB53")},initialize:function(){console.log("in initialize() of account-billing-default-view.js"),this.current_view=this,console.log("options:"),console.dir(this.options),this.braintree=n.create("MIIBCgKCAQEAwJo0HGLwcnHbj+LCBWEvxjjfZYTwoJuNvR34CevWwu71HeQ7s6kD9FuzK3nHFL0oA2/HchnhmWh4ilFzYq3/4U+hNLJwdG++MlZxQ9KlfLX2ROatmuOyIcD1mXKlKAEhuxU4OnTBnMByyzhy3Hz/9omOGWK0bjmSKkZabjwiqgs0E2VLeRaTERxWPPAKEPgKfiFjiYdOyYbXvvOtRU6kMze6ZoYnF098/RkrJuL8a+tn6otmQHJOvvLobJf0PYTH1YKEgx7JGhTQ0tvewd/gz4Lg8GMknM0HkGWaqtpLzeqahDGfik0PZQfWArvVQofOLVito0yY1Ck6G2A8mrjb/QIDAQAB"),console.log("braintree object"),console.dir(this.braintree)},render:function(){return console.log("in account-billing-default-view.js and render()"),this.$el.html(this.template()),this.$cc_number=this.$("#cc_number"),this.$cc_cvv=this.$("#cc_cvv"),this.$cc_month=this.$("#cc_month"),this.$cc_year=this.$("#cc_year"),this.field_to_set={},this},cc_number_update:function(e){console.log("cc_number");return},cc_cvv_update:function(e){console.log("cc_cvv");return},cc_month_update:function(e){console.log("cc_month");return},cc_year_update:function(e){console.log("cc_year");return},cc_number_blur:function(e){console.log("cc_number_blur"),this.close_input_field(this.$cc_number,"cc_number");return},cc_cvv_blur:function(e){console.log("cc_cvv_blur"),this.close_input_field(this.$cc_cvv,"cc_cvv");return},cc_month_blur:function(e){console.log("cc_month_blur"),this.close_input_field(this.$cc_month,"cc_month");return},cc_year_blur:function(e){console.log("cc_year_blur"),this.close_input_field(this.$cc_year,"cc_year");return},close_input_field:function(e,t){console.log("close_input_field()"),console.dir(e),console.log("model_attribute: "+t);var n=e.val().trim(),r=this.braintree.encrypt(n);this.field_to_set[t]=r,console.log("value entered into field, "+t+" is "+n),console.log("encrpyted value of entered into field, "+t+" is "+r);return},submit:function(){var e=this;console.log("in submit handler"),console.dir(this.field_to_set),$.ajax({url:"/api/users/change_cc_details/",type:"POST",data:e.field_to_set,success:function(t,n,s){console.log("SUCCESS: submitted the cc to braintree"),console.dir(t),console.log(n),console.dir(s);var o=e.$(".form-group");o.hasClass("has-error")&&o.removeClass("has-error");var u="#account_billing_new_cc_details > .successful_user_feedback",a=e.$(u);a.css("display")=="block"&&a.css("display","none");if(t.success===!1){if(!_.isEmpty(t.errors.validation_errors)){console.log("VALIDATION ERRORS");for(var f in t.errors.validation_errors){var l="#"+t.errors.validation_errors[f].param;console.log(l),$(l).parent(".form-group").addClass("has-error")}return}if(!_.isEmpty(t.errors.internal_errors)){console.log("INTERNAL ERRORS"),e.render();return}if(!_.isEmpty(t.errors.braintree_errors)){console.log("BRAINTREE ERRORS"),console.dir(t.errors.braintree_errors),e.render();return}}else{console.log("SUCCESSFUL CC DETAILS UPDATE");var c=new r({billing_data:t.result});console.log("billing_view is: "),console.dir(c),e.show_view("#account_main",c),c.$("#account_billing_credit_card").prepend(_.template(i)({success:"Updated billing details"})),window.scrollTo(0,350)}},error:function(t,n,r){console.log("ERROR: failed setting the braintree cc in vault"),console.dir(t),console.log(n),console.dir(r),e.render()}})},show_view:function(e,t){return console.log("in show_view()"),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t}});return s});