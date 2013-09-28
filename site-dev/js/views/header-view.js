// site/js/views/header-view.js

//view for the navbar at the top of the page

define([
    'backbone',
    'text!tpl/HeaderView.html'
  ], 
  function (Backbone, HeaderViewHTML) {
   
   var HeaderView = Backbone.View.extend({
   
     el:'#container-fluid',

     template: _.template(HeaderViewHTML),

     //className: 'blah',
 
     initialize: function () {




       this.render();
     },

     render: function () {
       this.$el.html(this.template());    

       return this;
    }

   });
   return HeaderView;
  }
);
