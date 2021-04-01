import Backbone from "backbone";
import _ from "underscore";

let TodoNewView = Backbone.View.extend({
//  template: _.template($('#todonew-template').html()), don't work
    events: {
        "submit #new-todo": "save"
    },
    initialize: function () {
        this.template = _.template($('#todonew-template').html());
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
