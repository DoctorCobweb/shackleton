define(["backbone","text!tpl/GigListItemView.html","views/gig-detail-view"],function(e,t,n){var r=e.View.extend({tagName:"li",className:"gigListItemContainer",template:_.template(t),events:{click:"clickedGig"},initialize:function(){this.model.on("change",this.render,this),this.model.on("destroy",this.close,this)},render:function(){return console.log("in GigListItemView render()"),this.$el.html(this.template(this.model.toJSON())),this},clickedGig:function(e){console.log("a gig list item, clicked NAME : "+this.model.get("mainEvent"));var t=new n({model:this.model});$("#featureContent").html(t.render().el)}});return r});