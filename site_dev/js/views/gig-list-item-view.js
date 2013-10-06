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
      //tagName: 'li',
      tagName: 'div',

      //className: 'gigListItemContainer',
      className: 'gig_list_item',

      template: _.template(GigListItemViewHTML),
      
      events: {'click': 'clickedGig',
               'mouseover #gig_list_item_a_el': 'mouse_over',
               'mouseleave #gig_list_item_a_el': 'mouse_leave',
      },

      mouse_leave: function () {
        //console.log('mouse_leave handler()');

        //cache the jquery result
        if (!this.$the_gig) {
          this.$the_gig = $('.gig_' + this.options.count);
        }
        this.$the_gig.css('background-color', '#42414B');

      },
 
      mouse_over: function () {
        //console.log('mouse_over handler()');
        //console.log($('.gig_' + this.options.count).css('background-color'));

        //cache the jquery result
        if (!this.$the_gig) {
          this.$the_gig = $('.gig_' + this.options.count);
        }
        this.$the_gig.css('background-color', '#2BBB53');


      },

      initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);

        console.log('this.options.count: ');
        console.log('this.options.count: ' + this.options.count);

      },

      render: function () {
        console.log('in GigListItemView render()');
           
        this.$el.html(this.template(this.model.toJSON()));

        //we use the count variable passed in from gigs-view.js to uniquely name the 
        //class attribute for each gig. needed to make css mouseover and mouseleave
        //events change colors etc.
        this.$el.addClass('gig_' + this.options.count);

        //cache some elements so we are not always walkin da DOM.
        //this.$the_gig = $('.gig_' + this.options.count); //this is undefined !!!
        //this.$the_gig = this.$('.gig_' + this.options.count); 
        //console.log('jquery cache: '); 
        //console.log(this.$('.gig_' + this.options.count));
        //console.log(this.$the_gig.css('background-color'));
    
        return this;
      },

      //when a gig is clicked, create a Gig then display it in the main area
      //with id="gig-guide-details"
      clickedGig: function (e) {

        if (!this.$the_gig) {
          this.$the_gig = $('.gig_' + this.options.count);
        }
        this.$the_gig.css('background-color', '#000');

        console.log('a gig list item, clicked NAME : ' + this.model.get('mainEvent')); 
        //console.log('a gig list item, clicked ID: ' + this.model.get('_id')); 
        //console.log('this.modal.attributes: ' + JSON.stringify(this.model));

        //TODO - get gig-list-item event all wired up properly.
        //Backbone.trigger('gig-item-clicked');


        var theGig = new Gig({model: this.model});
        //$('#gig-guide-details').html(theGig.render().el);
        
        $('#featureContent').html(theGig.render().el);
        window.scrollTo(0, 350);
      }
    });
    return GigListItemView;
  }
);
