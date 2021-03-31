import Backbone from "backbone";
import _ from "underscore";

let TodoEditView = Backbone.View.extend({
    template: _.template("<h1>Edit todo</h1>\n<form id=\"edit-todo\" name=\"todo\">\n" +
        "  <div class=\"field\">\n" +
        "    <label for=\"title\"> title:</label>\n" +
        "    <input type=\"text\" name=\"title\" id=\"title\" value=\"<%= title %>\" >\n" +
        "  </div><div class=\"field\">\n" +
        "    <label for=\"done\"> done:</label>\n" +
        "    <input type=\"checkbox\" name=\"done\" id=\"done\" <%= done ? 'checked=\"checked\"' : '' %> />" +
        "  </div><div class=\"actions\">\n" +
        "    <input type=\"submit\" value=\"Update Todo\" />\n" +
        "  </div></form><a href=\"#/index\">Back</a>\n"),
    events: {
        "submit #edit-todo": "update"
    },
    update: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.model.save({title: $('#title').val(), done: $('#done').prop("checked")});
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

export default TodoEditView;
