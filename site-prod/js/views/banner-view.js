define(["backbone","text!tpl/BannerView.html"],function(e,t){var n=e.View.extend({el:"#banner",template:_.template(t),className:"bannerContainer",initialize:function(){this.render()},render:function(){return this.$el.html(this.template()),this}});return n});