import Backbone from "backbone";
import _ from "underscore";

let TodoShowView = Backbone.View.extend({
    template: _.template("<p><b>Title: </b><%= title %></p><p><b>Done: </b>" +
        "<input type=\"checkbox\" name=\"done\" id=\"done\"" +
        "<%= done ? 'checked=\"checked\"' : '' %> /></p>" +
        "<a href=\"#/index\">Back</a>"),
    events: {
        "click #done" : "toggle"
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
