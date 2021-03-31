import Backbone from "backbone";
import _ from "underscore";

let SingleTodoView = Backbone.View.extend({
    template: _.template("<td>" +
        "<input type=\"checkbox\" name=\"done\" id=\"done\" <%= done ? 'checked=\"checked\"' : '' %> /></td>\n" +
        "<td><label><%= title %></label></td>\n\n" +
        "<td><a href=\"#/<%= id %>\">Show</a></td>\n" +
        "<td><a href=\"#/<%= id %>/edit\">Edit</a></td>\n" +
        "<td><a href=\"#/<%= id %>/destroy\" class=\"destroy\">Destroy</a></td>\n"),
    events: {
        "click .destroy" : "destroy",
        "click #done" : "toggle"
    },
    tagName: "tr",
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    destroy: function () {
        this.model.destroy();
        this.remove();
        return false;
    },
    toggle: function () {
        this.model.toggle();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('done', this.model.get('done'));
        return this;
    }
});

export default SingleTodoView;
