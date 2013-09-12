// site/js/views/successful-purchase-view.js
//

//maybe this should be just a generic view showing payment is being processed, or
//nothing at all, and once the this.model is updated after
//summary-and-credit-card-view.js saves its this.model (which is what this view also 
//uses for its model), decide on which view to create.
//e.g. if after the transaction finishes that transaction_status has string "authorized"
//then instantiate some view pertaining to that status



define([
    'backbone',
    'text!tpl/SuccessfulPurchaseView.html'
  ],
  function (Backbone, SuccessfulPurchaseHTML) {
    var SuccessfulPurchaseView = Backbone.View.extend({
      tagName: 'div',

      className: 'successfulPurchaseDetails',

      template: _.template(SuccessfulPurchaseHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of successful-purchase-view.js');
        console.log('is newOrder present? : ' + JSON.stringify(this.model));

 
        //add listener to this.model so the ui updates when server has 
        //finished with transaction and hence filling out the model's fields
        //n.b. when you use listenTo, the 'this' context in the callback refers
        //to the 'this' of the listening object.
        //in the case below, our callback is the view's render function and the
        //context of the listening object is the view itself. tricky but vital to know
        this.listenTo(this.model, 'change', this.render);
 
      },

      render: function () {
        console.log('in successful-purchase-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));

        return this;
      },

    }); //end Backbone.View.extend
    return SuccessfulPurchaseView;
  }
);
