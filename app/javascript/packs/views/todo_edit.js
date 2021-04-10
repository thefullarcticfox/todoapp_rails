import Backbone from "backbone";
import _ from "underscore";

let TodoEditView = Backbone.View.extend({
//  template: _.template($('#todoedit-template').html()), don't work
    events: {
        "submit #edit-todo": "update"
    },
    initialize: function () {
        this.template = _.template($('#todoedit-template').html());
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
