// Array Namespace

var app = {Models: {},Views: {}};

app.Models.ItemModel = Backbone.Model.extend({});

app.Views.ItemView = Backbone.View.extend({

  initialize:function () {

    this.template = _.template($("#itemTemplate").html());
    return this;

    },

    render:function (eventName) {

        this.setElement(this.template(this.model.toJSON()));
        //Hammer(this.el).on("swipe", this.swipe);
        return this;

    },

    events: {
        'click':'onClick'/*,
        'touchstart': 'onTouch'*/
    },

    mouseOver:function() {

        console.log("mouseOver");

    },

    swipe:function(){

        console.log("swipe");

    },

    onClick:function(){

      this.trigger('click');

    }/*,

    onTouch: function() {
        this.trigger('touchstart');
    }*/

});





