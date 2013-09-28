// site/js/views/gig-list-item-view.js

// using text.js plugin for reqiure.js to externalize templates.
// cleaner to move view templates outta index.html file.

define([
    'backbone',
    'text!tpl/GigListItemView.html',
    'views/gig-detail-view'
  ], 
  function (Backbone, GigListItemViewHTML, Gig) {
  
    var GigListItemView = Backbone.View.extend({
      tagName: 'li',

      className: 'gigListItemContainer',

      template: _.template(GigListItemViewHTML),
      
      events: {'click': 'clickedGig'},

      initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);

      },

      render: function () {
        console.log('in GigListItemView render()');
           
        this.$el.html(this.template(this.model.toJSON()));
    
        return this;
      },

      //when a gig is clicked, create a Gig then display it in the main area
      //with id="gig-guide-details"
      clickedGig: function (e) {

        console.log('a gig list item, clicked NAME : ' + this.model.get('mainEvent')); 
        //console.log('a gig list item, clicked ID: ' + this.model.get('_id')); 
        //console.log('this.modal.attributes: ' + JSON.stringify(this.model));

        //TODO - get gig-list-item event all wired up properly.
        //Backbone.trigger('gig-item-clicked');


        var theGig = new Gig({model: this.model});
        //$('#gig-guide-details').html(theGig.render().el);
        
        $('#featureContent').html(theGig.render().el);
      }
    });
    return GigListItemView;
  }
);
