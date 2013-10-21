define(["backbone","views/gigs-view","views/about-view","views/contact-view","views/login-view","views/home-landing-view","views/gig-detail-view","collections/gigGuide","views/gig-guide-landing-view","models/user-model","views/user-details-view","views/logged-out-view","models/order-model","views/number-of-tickets-view","collections/ordersCollection","views/checkout-view","views/account-view","views/register-view","views/privacy-policy-view","views/returns-policy-view","views/ticket-types-view","views/newsletter-view","views/faq-view","views/search-view","views/footer-view","views/beta-login-view","views/real-front-page-view","views/header-view","views/banner-view","cookie_util"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A){var O=e.Router.extend({initialize:function(){console.log("in initialize() of router.js");var t=this;this.reserved_order_id=null,$(window).on("beforeunload",function(){clearInterval(t.cookie_poller_id),console.log("(window).beforeunload callback for 'beforeunload' event"),console.log("this variable"),console.log(this);var e={reserved_order_id:t.reserved_order_id};return $.ajax({url:"/api/orders/beforeunload_event_called",type:"POST",data:e,success:function(e,n,r){console.log("SUCCESS: Got response"),console.dir(e),console.log(n),console.dir(r),console.log("EVENT: beforeunload event was fired"),console.log(t),console.log("is jQuery present: "),console.dir($);if(e.success===!1){if(!_.isEmpty(e.errors.validation_errors)){console.log("VALIDATION_ERRORS: we have validation errors when releasing tickets");return}if(!_.isEmpty(e.errors.internal_errors)){console.log("INTERNAL_ERRORS: we have internal errors when releasing tickets");return}}else console.log("SUCCESS: released the tickets, resetting the reserved_order_id..."),t.reserved_order_id=null},error:function(e,t,n){console.log("ERROR: ajax callback handler"),console.dir(e),console.log(t),console.dir(n)}}),"Are you sure you want to leave this page?"}),e.on("router:set_current_view",function(e){console.log("CUSTOM_EVENT(router:set_current_view), heard)"),console.log("CUSTOM_EVENT(router:set_current_view), heard): parameter(the_current_view): "+e),console.log(e)},this),e.on("order:start",function(e){console.log("CUSTOM_EVENT(order:start, heard)"),console.log("CUSTOM_EVENT(order:start, heard): parameter(the_order_id): "+e),this.reserved_order_id=e,console.log(" in order:start and this.reserved_order_id: "+this.reserved_order_id),this.start_checking_for_cookie("reserve_tickets")},this),e.on("order:finished",function(){console.log("CUSTOM_EVENT(order:finished, heard)"),clearInterval(this.cookie_poller_id),this.reserved_order_id=null,A.unset("reserve_tickets")},this),e.on("order:stop_polling",function(){console.log("CUSTOM_EVENT(order:stop_polling, heard)"),clearInterval(this.cookie_poller_id)},this)},start_checking_for_cookie:function(e){console.log("in start_checking_for_cookie handler");var t=this;this.cookie_poller_id=setInterval(function(){console.log("this.reserved_order_id: "+t.reserved_order_id);if(!A.get(e)&&t.reserved_order_id){console.log("RESERVATION_TIMEOUT: releasing ticket holds..."),console.log("CookieUtil.get("+e+") returned null"),t.give_up_reserved_tickets(e,t.reserved_order_id);return}console.log("CookieUtil: a cookie called "+e+"present.");return},1e3)},give_up_reserved_tickets:function(e,t){console.log("in clear_out_cookie function");var n=this;clearInterval(this.cookie_poller_id),$.ajax({url:"/api/orders/give_up_reserved_tickets",type:"POST",data:{the_cookie:e,reserved_order_id:t},success:function(e,t,r){console.log("SUCCESS: ajax callback handler"),console.dir(e),console.log(t),console.dir(r);if(e.success===!1){if(!_.isEmpty(e.errors.validation_errors))return console.log("VALIDATION_ERRORS: we have validation errors when releasing tickets"),n.give_up_reserved_tickets();if(!_.isEmpty(e.errors.internal_errors))return console.log("INTERNAL_ERRORS: we have internal errors when releasing tickets"),n.give_up_reserved_tickets()}else console.log("SUCCESS: released the tickets, resetting the reserved_order_id..."),n.reserved_order_id=null},error:function(e,t,n){console.log("ERROR: ajax callback handler"),console.dir(e),console.log(t),console.dir(n)}})},routes:{"":"index",about:"about",login:"login",contact:"contact",gigs:"gig_guide","gigs/:id":"gig_details","users/session/:id":"session",logout:"logout","users/session/goodbye":"goodbye","delete-user-account/:id":"delete_user_account",account:"account",privacy_policy:"privacy_policy",returns_policy:"returns_policy",ticket_types:"ticket_types",newsletter:"newsletter",faq:"faq",search:"search",register:"register",footer:"footer"},footer:function(){console.log("in footer() of router.js"),this.check_authentication_set_links(),this.is_bootstrap_btn_navbar_visible(),this.theFooterView=new T,this.show_view("#featureContent",this.theFooterView)},register:function(){console.log("in register() of router.js"),this.check_authentication_set_links(),this.is_bootstrap_btn_navbar_visible(),this.theRegisterView=new g,this.show_view("#featureContent",this.theRegisterView)},privacy_policy:function(){console.log("in privacy_policy handler"),this.thePrivacyPolicyView||(this.thePrivacyPolicyView=new y),this.show_view("#featureContent",this.thePrivacyPolicyView),window.scrollTo(0,350)},returns_policy:function(){console.log("in returns_policy handler"),this.theReturnsPolicyView||(this.theReturnsPolicyView=new b),this.show_view("#featureContent",this.theReturnsPolicyView),window.scrollTo(0,350)},ticket_types:function(){console.log("in ticket_types handler"),this.theTicketTypesView||(this.theTicketTypesView=new w),this.show_view("#featureContent",this.theTicketTypesView),window.scrollTo(0,350)},newsletter:function(){console.log("in newsletter handler"),this.theNewsletterView||(this.theNewsletterView=new E),this.show_view("#featureContent",this.theNewsletterView),window.scrollTo(0,350)},faq:function(){console.log("in faq handler"),this.theFaqView||(this.theFaqView=new S),this.show_view("#featureContent",this.theFaqView),window.scrollTo(0,350)},search:function(){console.log("in search handler"),this.theSearchView||(this.theSearchView=new x),this.show_view("#featureContent",this.theSearchView),window.scrollTo(0,350)},account:function(){console.log("in account handler"),this.is_bootstrap_btn_navbar_visible(),this.check_authentication_set_links();var e=new m;this.show_view("#featureContent",e)},test_router_ref:function(){console.log("CALLED ROUTER REF")},index:function(){console.log("in INDEX of router.js");var e=this;console.log("using CookieUtil to get reserve_tickets cookie..."),console.log("reserve_tickets cookie: "+A.get("reserve_tickets")),console.log("in index() of router.js"),this.is_bootstrap_btn_navbar_visible(),this.check_authentication_set_links(),this.theHomeLandingView||(this.theHomeLandingView=new s),this.show_view("#featureContent",this.theHomeLandingView)},about:function(){console.log("in about() of router.js"),this.is_bootstrap_btn_navbar_visible(),this.check_authentication_set_links(),this.theAboutView||(this.theAboutView=new n),this.show_view("#featureContent",this.theAboutView)},login:function(){console.log("in login() of router.js"),this.is_bootstrap_btn_navbar_visible(),this.check_authentication_set_links();var e=new i;this.show_view("#featureContent",e)},contact:function(){console.log("in contact() of router.js"),this.is_bootstrap_btn_navbar_visible(),this.check_authentication_set_links(),this.theContactView||(this.theContactView=new r),this.show_view("#featureContent",this.theContactView)},gig_guide:function(){console.log("in gigGuide() of router.js"),this.is_bootstrap_btn_navbar_visible(),this.check_authentication_set_links(),this.theGigList||(this.theGigList=new u);var e=this;this.theGigList.fetch({success:function(n,r){console.log("self.theGigList.length = "+e.theGigList.length),e.theGigsView=new t({model:e.theGigList}),e.show_view("#featureContent",e.theGigsView),e.requestedId&&(e.navigate("//gigs/"+e.requestedId),e.gig_details(e.requestedId),e.requestedId=null)},error:function(e,t){console.log("ERROR: in router.js and gigGuide handler")}})},gig_details:function(e){console.log("in getDetails() of router.js, with id = "+e),this.check_authentication_set_links(),this.defaultLandingView&&(console.log("gigDetails() of router.js and this.defaultLandingView is != null"),this.defaultLandingView.close(),this.defaultLandingView=null),this.theGigList?(this.gig=this.theGigList.get(e),this.selectedGigPrice=this.gig.get("price"),this.show_view("#featureContent",new o({model:this.gig}))):(this.requestedId=e,this.gig_guide())},session:function(e){console.log("USER AUTHENTICATED: in session() in router.js"),console.log("USER AUTHENTICATED:id: "+e+" in session() in router.js");if(!this.userDetailsView){this.userModel=new f({_id:e}),console.log("userModel id: "+this.userModel.get("_id"));var t=this;this.userModel.fetch({success:function(e,n,r){console.log("SUCCESS: in session handler. fetched user data from server."),console.dir(e),t.userDetailsView=new l({model:e}),t.navigate("#/hello/"+e.get("first_name"),{replace:!0}),t.show_view("#featureContent",t.userDetailsView),t.switch_log_button("#logout_header","#login_header"),t.display_account_tab(!0)},error:function(e,t,n){console.log("ERROR: in session handler of router.js")}})}},logout:function(){var e=this;console.log("in logout() route."),this.is_bootstrap_btn_navbar_visible(),$.ajax({url:"/api/users/logout",type:"DELETE",success:function(t,n,r){console.dir(t),console.log("Delete response:"),console.log(n),console.dir(r),console.log("self.reserved_order_id: "+e.reserved_order_id),A.get("reserve_tickets")&&e.reserved_order_id&&(console.log("there is a reserve_tickets cookie present, delete it"),e.give_up_reserved_tickets("reserved_tickets",e.reserved_order_id)),e.goodbye(t),e.switch_log_button("#login_header","#logout_header"),e.display_account_tab(!1)}})},goodbye:function(e){this.loggedOutView||(this.loggedOutView=new c),this.navigate("#/goodbye/"+e,{replace:!0}),this.show_view("#featureContent",this.loggedOutView)},delete_user_account:function(e){console.log("and this.userModel.get('id'): "+this.userModel.get("_id"));var t=this;$.ajax({url:"/api/users/session",type:"GET",success:function(n,r,i){console.dir(n),console.log("Get response:"),console.log(r),console.dir(i),n._id===e&&n.authenticated===!0&&t.userModel&&t.userModel.get("_id")===e?(console.log("in deleteUserAccount handler, self.userModel is defined and self.userModel.get('id'): "+t.userModel.get("_id")+"and self.userModel.get('id') === id (from url param) is true "),t.userModel.destroy({success:function(e,n){console.log("in success callback in self.userModel.destroy()"),console.dir(e),console.log("in success callback,  response:"),console.dir(n),t.logout()},error:function(e,t){console.log("in error callback in self.userModel.destroy()"),console.dir(e),console.log("in error callback,  response:"),console.dir(t)}})):console.log("in deleteUserAccount handler and !this.userModel === true")}})},is_bootstrap_btn_navbar_visible:function(){console.log("in is_bootstrap_btn_navbar_visible handler");var e=$("button.navbar-toggle").css("display");console.log("button.navbar-toggle has css attribute display: "+e),e==="block"&&(console.log("btn-navbar is displayed on page"),this.is_bootstrap_nav_collapse_visible()),e==="none"&&console.log("btn-navbar is NOT displayed on page")},is_bootstrap_nav_collapse_visible:function(){console.log("in is_bootstrap_nav_collapse_visible handler");var e=$("div.navbar-collapse.in").css("display");console.log("div.navbar-collapse.in has css attribute display: "+e),e==="none"&&console.log("div.navbar-collapse.in has display:none on page"),e==="block"&&(console.log("div.navbar-collapse.in has block: "+e),$("div.navbar-collapse.in").removeClass("in"),$("button.navbar-toggle").addClass("collapsed"))},check_authentication_set_links:function(){console.log("in check_authentication_set_links handler");var e=this;$.ajax({url:"/api/users/session",type:"GET",success:function(t,n,r){t.user_authenticated===!0&&(console.dir(t),console.log("Get response: yuppupupup"),console.log(n),console.dir(r),e.switch_log_button("#logout_header","#login_header"),e.display_account_tab(!0))}})},switch_log_button:function(e,t){$(t).css("display","none"),$(e).css("display","block")},display_account_tab:function(e){e?$("#account").css("display","block"):$("#account").css("display","none")},show_view:function(e,t){return console.log("in showView()"),console.log("in showView(), this.currentView: "),console.log(this.currentView),this.currentView&&this.currentView.close(),$(e).html(t.render().el),this.currentView=t,t}});return O});