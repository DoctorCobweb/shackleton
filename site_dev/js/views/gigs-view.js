//site/js/views/gigs-view.js


//import gigGuide collection to initialize the collection when app starts:
//start app -> start GigsView -> start gigGuide collection -> download gigs

// the collection of gig models is called  'GigGuide'

define([
    'backbone',
    'views/gig-list-item-view',
    'collections/gigGuide',
    'views/gig-guide-landing-view'
  ], 
  function (Backbone, GigListItemView, GigGuide, GigGuideLandingView) {

    var GigsView = Backbone.View.extend({
      tagName: 'div',

      className: 'gigs_container',
   
      events: {},

      initialize: function () {
        console.log('in intialize in views/gigs-view.js');

        this.count = 1;

        //this.listenTo(this.collection, 'add', this.);
        // fetch contents of collection too
        // set listeners for add, reset events on collection
        //this.listenTo(this.collection, 'add', this.renderGig);
        //this.listenTo(this.collection, 'reset', this.render);

        //an array to keep hold all the refs to each gig.
        //use this array to properly close each gig item if user navigates away or
        //thru to next step. 
        //used in beforeClose() (!important)
        this.child_views = [];
      },

      render: function () {
        console.log('in render() of gigs-view.js');
     

        // render the GigsView by rendering each gig in collection
        _.each(this.model.models, function (item) {
          this.renderGigListItem(item);
        }, this);

        return this;
      },

      renderGigListItem: function (item) {
        //console.log('in renderGigListItem() of gigs-view.js');
        var self = this;

        // instantiate a new gig
        var gigListItemView = new GigListItemView({model: item, count:self.count});

        //gigListItemView.parent = this;

        this.child_views.push(gigListItemView);
        
        this.count++; 
        //console.log(this.count);
        
    
        // call its render function, append its element to GigsView element, el
        this.$el.append(gigListItemView.render().el);
      },

      //DONT BE SLOPPY, CLEANUP AFTER YOURSLEF.
      // you must properly close each gig view before closing the gigs-view (which is 
      // the parent view)
      beforeClose: function () {
        console.log('in beforeClose of gigs-view');

        _.each(this.child_views, function (view) {
          view.close();
        }, this);
      }



    });
    return GigsView;
  }
);
