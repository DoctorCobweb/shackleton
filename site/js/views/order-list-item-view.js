// site/js/views/order-list-item-view.js

// using text.js plugin for reqiure.js to externalize templates.
// cleaner to move view templates outta index.html file.

define([
    'backbone',
    'text!tpl/OrderListItemView.html',
    //'views/order-detail-view'
  ], 
  function (Backbone, OrderListItemViewHTML
            //, Order
           ) {
  
    var OrderListItemView = Backbone.View.extend({
      tagName: 'li',

      className: 'order_list_item_container',

      template: _.template(OrderListItemViewHTML),
      
      //events: {'click': 'clicked_order'},

      initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);

      },

      render: function () {
        console.log('in OrderListItemView render()');
           
        this.$el.html(this.template(this.model.toJSON()));
    
        return this;
      },

      /*
      clicked_order: function (e) {

        console.log('an order list item, clicked NAME : ' + this.model.get('_id')); 

        var _order = new Order({model: this.model});
        //$('#gig-guide-details').html(theGig.render().el);
        
        $('#account_main').html(theGig.render().el);
      }
      */

    });
    return OrderListItemView;
  }
);
