import Backbone from "backbone";
import _ from "underscore";

const TodoViews = {};

$(function () {
    TodoViews.SingleTodoView = Backbone.View.extend({
        template: _.template($('#singletodo-template').html()),
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

    TodoViews.IndexView = Backbone.View.extend({
        template: _.template($('#todoindex-template').html()),
        initialize: function () {
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch();
        },
        addOne: function (todo) {
            let view = new TodoViews.SingleTodoView({model: todo});
            this.$("tbody").append(view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this)
        },
        render: function() {
            this.$el.html(this.template(this.collection.toJSON()));
            this.addAll();
            return this;
        }
    });

    TodoViews.ShowView = Backbone.View.extend({
        template: _.template($('#todoshow-template').html()),
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

    TodoViews.EditView = Backbone.View.extend({
        template: _.template($('#todoedit-template').html()),
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

    TodoViews.NewView = Backbone.View.extend({
        template: _.template($('#todonew-template').html()),
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
})

export default TodoViews;
