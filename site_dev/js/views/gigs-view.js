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

    GigsView = Backbone.View.extend({
      //tagName: 'ul',
      tagName: 'div',

      className: 'gigs_container',
   
      events: {},

      initialize: function () {
        console.log('in intialize in views/gigs-view.js');

        this.count = 1;

        /*
        //create the default landing view for the guide guide
        var theGigGuideLandingView = new GigGuideLandingView();
        $('#featureContent').html(theGigGuideLandingView.render().el);
        */

        /*
        // initialize gigGuide collection here
        this.collection = new GigGuide();
        var self = this;
        this.collection.fetch({
          reset: true,
          success: function (collection, response) {
            //console.log('successfully fetched the collection from server.');
            //console.log('collection.length = ' + collection.length); 
            //console.log(self.collection.get("51a405be30171f4508000002"));
          },
          error: function (collection, response) {
            console.log('in initialize(), GigsView. error in fetching the collection.');
          }
        });
        */

        //this.render();
        
        //this.listenTo(this.collection, 'add', this.);
        // fetch contents of collection too
        // set listeners for add, reset events on collection
        //this.listenTo(this.collection, 'add', this.renderGig);
        //this.listenTo(this.collection, 'reset', this.render);
      },

      render: function () {
        console.log('in render() of gigs-view.js');
     
        /*
        // render the GigsView by rendering each gig in collection
        this.collection.each(function (item) {
          //console.log('in collection.each() of render() in gigs-view.js');
          this.renderGigListItem(item);
        }, this);
        */ 


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
        
        this.count++; 
        //console.log(this.count);
        
    
        // call its render function, append its element to GigsView element, el
        this.$el.append(gigListItemView.render().el);
      }
    });
    return GigsView;
  }
);
