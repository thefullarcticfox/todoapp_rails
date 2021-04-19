// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/).

import _ from "underscore"
import Backbone from "backbone"

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
    // Todo Model
    // ----------
    // Our basic **Todo** model has `title`, `order`, and `done` attributes.
    let Todo = Backbone.Model.extend({
        urlRoot: '/todos',

        // Default attributes for the todo item.
        defaults: function() {
            return {
                title: "empty todo...",
                done: false
            };
        },

        // Toggle the `done` state of this todo item.
        toggle: function() {
            this.save({done: !this.get("done")});
        }
    });

    // Todo Collection
    // ---------------
    // The collection of todos is backed by Rails Controller.
    let TodoList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Todo,
        url: '/todos',

        // Filter down the list of all todo items that are finished.
        done: function() {
            return this.where({done: true});
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            return this.where({done: false});
        },

        // Todos are sorted by their original insertion order.
        comparator: 'created_at'
    });

    // Todo Item View
    // --------------
    // The DOM element for a todo item...
    let TodoView = Backbone.View.extend({

        //... is a list tag.
        tagName:  "li",

        // Cache the template function for a single item.
        template: _.template($('#item-template').html()),

        // The DOM events specific to an item.
        events: {
            "click .toggle"   : "toggleDone",
            "dblclick .view"  : "edit",
            "click a.destroy" : "clear",
            "keypress .edit"  : "updateOnEnter",
            "blur .edit"      : "close"
        },

        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        // Re-render the titles of the todo item.
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        // Toggle the `"done"` state of the model.
        toggleDone: function() {
            this.model.toggle();
        },

        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
            this.$el.addClass("editing");
            this.input.focus();
        },

        // Close the `"editing"` mode, saving changes to the todo.
        close: function() {
            let value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass("editing");
            }
        },

        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
            if (e.keyCode === 13) this.close();
        },

        // Remove the item, destroy the model.
        clear: function() {
            this.model.destroy();
        }

    });

    // The Application
    // ---------------
    // Our overall **AppView** is the top-level piece of UI.
    let AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: $("#todoapp"),

        // Our template for the line of statistics at the bottom of the app.
        statsTemplate: _.template($('#stats-template').html()),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #new-todo":  "createOnEnter",
            "click #clear-completed": "clearCompleted",
            "click #toggle-all": "toggleAllComplete"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos
        initialize: function() {

            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#toggle-all")[0];

            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'all', this.render);

            this.footer = this.$('footer');
            this.main = $('#main');

            this.collection.fetch({reset: true});
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function() {
            let done = this.collection.done().length;
            let {length: remaining} = this.collection.remaining();

            if (this.collection.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
            } else {
                this.main.hide();
                this.footer.hide();
            }
            this.allCheckbox.checked = !remaining;
        },

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(todo) {
            let view = new TodoView({model: todo});
            this.$("#todo-list").append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        addAll: function() {
            this.collection.each(this.addOne, this);
        },

        // If you hit return in the main input field, create new **Todo** model
        createOnEnter: function(e) {
            if (e.keyCode !== 13) return;
            if (!this.input.val()) return;

            this.collection.create({title: this.input.val()});
            this.input.val('');
        },

        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
            _.invoke(this.collection.done(), 'destroy');
            return false;
        },

        toggleAllComplete: function () {
            let done = this.allCheckbox.checked;
            this.collection.each(function (todo) { todo.save({'done': done}); });
        }

    });

    let AppRouter = Backbone.Router.extend({
       initialize: function () {
           this.collection = new TodoList;
           this.appview = new AppView({collection: this.collection});
       },
        routes: {
            "index"     : "index",
            ".*"        : "index"
       },
       index: function () {
           this.appview.render();
       }
    });

    class TodoApp {
        constructor() {
            this.router = new AppRouter;
        }
    }

    let App = new TodoApp;
})
