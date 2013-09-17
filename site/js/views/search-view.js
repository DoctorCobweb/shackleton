// site/js/views/search-view.js


define([
    'backbone',
    'text!tpl/SearchView.html'
  ],
  function (Backbone, SearchViewHTML) {
    var SearchView  = Backbone.View.extend({
      tagName: 'div',

      className: 'search_details',

      template: _.template(SearchViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of search-view.js');
      },

      render: function () {
        console.log('in search-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return SearchView;
  }
);
