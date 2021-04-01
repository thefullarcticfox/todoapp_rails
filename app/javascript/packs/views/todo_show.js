import Backbone from "backbone";
import _ from "underscore";

let TodoShowView = Backbone.View.extend({
//  template: _.template($('#todoshow-template').html()), don't work
    events: {
        "click #done" : "toggle"
    },
    initialize: function() {
        this.template = _.template($('#todoshow-template').html());
    },
    toggle: function () {
        this.model.toggle();
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

export default TodoShowView;
