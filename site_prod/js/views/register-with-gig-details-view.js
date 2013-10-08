define(["backbone","text!tpl/RegisterWithGigDetailsView.html","models/user-model","views/number-of-tickets-view"],function(e,t,n,r){var i=e.View.extend({tagName:"div",className:"register_with_gig_details",template:_.template(t),events:{"keypress #first_name":"first_name_keypress","keypress #last_name":"last_name_keypress","keypress #phone_number":"phone_number_keypress","keypress #email_address":"email_address_keypress","keypress #password":"password_keypress","blur #first_name":"first_name_blur","blur #last_name":"last_name_blur","blur #phone_number":"phone_number_blur","blur #email_address":"email_address_blur","blur #password":"password_blur","click #register":"register"},initialize:function(){console.log("in initialize() of register-with-gig-details-view.js"),console.dir(this.model),this.current_view=this,this.ENTER_KEY=13},render:function(){return console.log("in register-with-gig-details-view.js and render()"),this.$el.html(this.template(this.model.toJSON())),this.$first_name=this.$("#first_name"),this.$last_name=this.$("#last_name"),this.$phone_number=this.$("#phone_number"),this.$email_address=this.$("#email_address"),this.$password=this.$("#password"),this.registration_details={},this},first_name_keypress:function(e){console.log("in first_name_keypress");return},last_name_keypress:function(e){console.log("in last_name_keypress");return},phone_number_keypress:function(e){console.log("in phone_number_keypress");return},email_address_keypress:function(e){console.log("in email_address_keypress");return},password_keypress:function(e){console.log("in password_keypress"),e.which===this.ENTER_KEY&&(console.log("in password_keypress and ENTER_KEY was pressed"),this.close_input_field(this.$password,"password"),this.register());return},first_name_blur:function(e){console.log("in first_name_blur"),this.close_input_field(this.$first_name,"first_name");return},last_name_blur:function(e){console.log("in last_name_blur"),this.close_input_field(this.$last_name,"last_name");return},phone_number_blur:function(e){console.log("in phone_number_blur"),this.close_input_field(this.$phone_number,"phone_number");return},email_address_blur:function(e){console.log("in email_address_blur"),this.close_input_field(this.$email_address,"email_address");return},password_blur:function(e){console.log("in password_blur"),this.close_input_field(this.$password,"password");return},close_input_field:function(e,t){console.log("in close_input_field"),console.dir(e),console.log("attribute: "+t);var n=e.val().trim();this.registration_details[t]=n;return},register:function(){console.log("in register function");var e=this;$.ajax({url:"/api/users/register",type:"POST",data:e.registration_details,success:function(t,n,i){console.log("SUCCESS: in ajax success callback"),console.dir(t),console.log(n),console.dir(i);var s=e.$(".form-group");s.hasClass("has-error")&&s.removeClass("has-error");if(t.success===!0){console.log("SUCCESS: registration success.");var o=new r({model:e.model});e.show_view("#featureContent",o),e.display_account_tab(!0),e.switch_log_button("#logout_header","#login_header"),window.scrollTo(0,350)}if(t.errors.duplicate_email===!0){console.log("ERROR: DUPLICATE_EMAIL");var u=$("#email_address");u.parent(".form-group").addClass("has-error")}if(!_.isEmpty(t.errors.validation_errors)){console.log("ERROR: VALIDATION_ERROR"),console.dir(t.errors.validation_errors);for(var a in t.errors.validation_errors){var f="#"+t.errors.validation_errors[a].param;console.log(f),$(f).parent(".form-group").addClass("has-error")}}},error:function(t,n,r){console.log("ERROR: ajax error callback: registration error"),console.dir(t),console.log(n),console.dir(r),e.render()}})},switch_log_button:function(e,t){$(t).css("display","none"),$(e).css("display","block")},display_account_tab:function(e){e?$("#account").css("display","block"):$("#account").css("display","none")},show_view:function(e,t){return console.log("in show_view()"),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t}});return i});