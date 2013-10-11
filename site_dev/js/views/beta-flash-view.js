// site/js/views/beta-flash-view.js
//the view for beta flash screen to be displayed.

define([
    'backbone',
    'text!tpl/BetaFlashView.html'
  ], 
  function (Backbone, BetaFlashHTML) {
    var BetaFlashView = Backbone.View.extend({
      tagName: 'div',
 
      className: 'view_beta_flash',

      template: _.template(BetaFlashHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of beta-flash-view.js');
        this.current_view = this;


        this.options.router_ref.test_router_ref(); 
      },

      render: function () {
        console.log('in beta-flash-view.js and render()');

        this.$el.html(this.template());
  
        return this;
      },
      
      show_view: function (selector, view) {
        console.log('in show_view()');
        if (this.current_view) {
          this.current_view.close();
        }
        $(selector).html(view.render().el);
        this.current_view = view;
        return view;
      }



    });
    return BetaFlashView;
  }
);
