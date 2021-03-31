import Backbone from "backbone";
import _ from "underscore";

let TodoNewView = Backbone.View.extend({
    template: _.template("<h1>New todo</h1>\n" +
        "<form id=\"new-todo\" name=\"todo\">\n" +
        "  <div class=\"field\">\n" +
        "    <label for=\"title\"> title:</label>\n" +
        "    <input type=\"text\" name=\"title\" id=\"title\" value=\"<%= title %>\" >\n" +
        "  </div><div class=\"field\">\n" +
        "    <label for=\"done\"> done:</label>\n" +
        "    <input type=\"checkbox\" name=\"done\" id=\"done\" <%= done ? 'checked=\"checked\"' : '' %> />\n" +
        "  </div>\n" +
        "  <div class=\"actions\">\n" +
        "    <input type=\"submit\" value=\"Create Todo\" />\n" +
        "  </div></form><a href=\"#/index\">Back</a>"),
    events: {
        "submit #new-todo": "save"
    },
    initialize: function () {
        this.model = new this.collection.model();
        this.model.bind("change:errors", function () { this.render(); });
    },
    save: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.model.unset("errors")
        this.collection.create({title: $('#title').val(), done: $('#done').prop("checked")});
    },
    error: function (todo, jqXHR) {
        this.model.set({errors: $.parseJSON(jqXHR.responseText)});
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

export default TodoNewView;
