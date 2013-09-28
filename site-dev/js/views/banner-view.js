// site/js/views/banner-view.js

//view for the banner stip at top of the page

define([
    'backbone',
    'text!tpl/BannerView.html'
  ], 
  function (Backbone, BannerViewHTML) {

    var BannerView = Backbone.View.extend({
      el: '#banner',
  
      template: _.template(BannerViewHTML),

      className: 'bannerContainer',
  
      initialize: function () {
        this.render(); 
  
      },

      render: function () {

        this.$el.html(this.template());
  
        return this;
      }

    });
    return BannerView;
  }
);
