define(["backbone","text!tpl/LoginView.html","views/register-view","views/user-details-view","models/user-model"],function(e,t,n,r,i){var s=e.View.extend({tagName:"div",className:"login_details",template:_.template(t),events:{"keypress #email_address":"email_address_update","keypress #password":"password_update","blur #email_address":"email_address_blur","blur #password":"password_blur","click #login":"login","click #register":"register"},initialize:function(){console.log("in initialize() of login-view.js"),this.ENTER_KEY=13},render:function(){return console.log("in login-view.js and render()"),this.$el.html(this.template()),this.$email_address=this.$("#email_address"),this.$password=this.$("#password"),console.dir(this.$email_address),console.dir(this.$password),console.dir(this),this.field_to_set={},this},email_address_update:function(e){console.log("email_address_update")},password_update:function(e){console.log("password_update"),e.which===this.ENTER_KEY&&(this.close_input_field(this.$password,"password"),this.login())},email_address_blur:function(e){console.log("email_address_blur"),this.close_input_field(this.$email_address,"email_address");return},password_blur:function(e){console.log("password_blur"),this.close_input_field(this.$password,"password");return},close_input_field:function(e,t){console.log("close_input_field"),console.dir(e),console.log("model_attribute: "+t);var n=e.val().trim();this.field_to_set[t]=n,console.dir(this.field_to_set)},login:function(e){console.log("in login event handler"),console.dir(this.field_to_set);var t=this;$.ajax({url:"/api/users/login",type:"POST",data:t.field_to_set,success:function(e,n,s){console.log("SUCCESS: POST /api/users/login"),console.dir(e),console.log(n),console.dir(s);if(e.user_authenticated){t.switch_log_button("#logout_header","#login_header"),t.display_account_tab(!0);var o=new i({_id:e.user_id});o.fetch({success:function(e,n){console.log("SUCCESS: fetched the user model"),console.dir(e),console.log(n);var i=new r({model:e});t.show_view("#featureContent",i)},error:function(e,t){console.log("ERROR: in fetching the user model"),console.dir(e),console.log(t)}})}else console.log("LOGIN FAILED, TRY AGAIN"),console.log(e),t.render()},error:function(e,t,n){console.log("ERROR: POST /api/users/login"),console.dir(e),console.log(t),console.dir(n)}})},register:function(e){console.log("in register event handler");var t=new n;this.show_view("#featureContent",t)},switch_log_button:function(e,t){$(t).css("display","none"),$(e).css("display","block")},show_view:function(e,t){return console.log("in show_view()"),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t},display_account_tab:function(e){e?$("#account").css("display","block"):$("#account").css("display","none")}});return s});