define(["backbone","text!tpl/GigListItemView.html","views/gig-detail-view"],function(e,t,n){var r=e.View.extend({tagName:"div",className:"gig_list_item",template:_.template(t),events:{click:"clickedGig","mouseover #gig_list_item_a_el":"mouse_over","mouseleave #gig_list_item_a_el":"mouse_leave"},mouse_leave:function(){this.$the_gig||(this.$the_gig=$(".gig_"+this.options.count)),this.$the_gig.css("background-color","#42414B")},mouse_over:function(){this.$the_gig||(this.$the_gig=$(".gig_"+this.options.count)),this.$the_gig.css("background-color","#2BBB53")},initialize:function(){this.model.on("change",this.render,this),this.model.on("destroy",this.close,this),this.current_view=this},render:function(){return this.$el.html(this.template(this.model.toJSON())),this.$el.addClass("gig_"+this.options.count),this},clickedGig:function(e){this.$the_gig||(this.$the_gig=$(".gig_"+this.options.count)),this.$the_gig.css("background-color","#000"),console.log("a gig list item, clicked NAME : "+this.model.get("mainEvent"));var t=new n({model:this.model});$("#featureContent").html(t.render().el),window.scrollTo(0,350)},show_view:function(e,t){return console.log("in showView()"),console.log("in showView(), this.currentView: "),console.log(this.current_view),this.current_view&&this.current_view.close(),$(e).html(t.render().el),this.current_view=t,t}});return r});