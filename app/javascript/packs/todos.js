// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone.localStorage.html)
// to persist Backbone models within your browser.

import _ from "underscore"
import Backbone from "backbone"

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

    // Todo Model
    // ----------

    // Our basic **Todo** model has `title`, `order`, and `done` attributes.
    let Todo = Backbone.Model.extend({
        // urlRoot: '/todos',

        // Default attributes for the todo item.
        defaults: function() {
            return {
                title: "empty todo...",
                // order: Todos.nextOrder(),
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

    // The collection of todos is backed by *localStorage* instead of a remote
    // server.
    let TodoList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Todo,
        url: '/todos',

        // Save all of the todo items under the `"todos-backbone"` namespace.
        // localStorage: new Backbone.LocalStorage("todos-backbone"),

        // Filter down the list of all todo items that are finished.
        done: function() {
            return this.where({done: true});
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            return this.where({done: false});
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'

    });

    // Create our global collection of **Todos**.
    let Todos = new TodoList;

    // Todo Item View
    // --------------

    // The DOM element for a todo item...
    let TodoView = Backbone.View.extend({

        //... is a list tag.
        tagName:  "li",

        // Cache the template function for a single item.
        template: _.template("<div class=\"view\">\n" +
            "<input class=\"toggle\" type=\"checkbox\" <%= done ? 'checked=\"checked\"' : '' %> />\n" +
            "<label><%- title %></label>\n" +
            "<a class=\"destroy\"></a></div>\n" +
            "<input class=\"edit\" type=\"text\" value=\"<%- title %>\" />"),
        //_.template($('#item-template').html()),

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
        statsTemplate: _.template(
            "<% if (done) { %>\n" +
            "<a id=\"clear-completed\">Clear <%= done %> completed <%= done == 1 ? 'item' : 'items' %></a>\n" +
            "<% } %>\n" +
            "<div class=\"todo-count\"><b><%= remaining %></b> <%= remaining == 1 ? 'item' : 'items' %> left</div>\n"),
        //_.template($('#stats-template').html()),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #new-todo":  "createOnEnter",
            "click #clear-completed": "clearCompleted",
            "click #toggle-all": "toggleAllComplete"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {

            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#toggle-all")[0];

            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'all', this.render);

            this.footer = this.$('footer');
            this.main = $('#main');

            Todos.fetch();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function() {
            let done = Todos.done().length;
            let {length: remaining} = Todos.remaining();

            if (Todos.length) {
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
            Todos.each(this.addOne, this);
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function(e) {
            if (e.keyCode !== 13) return;
            if (!this.input.val()) return;

            Todos.create({title: this.input.val()});
            this.input.val('');
        },

        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
            _.invoke(Todos.done(), 'destroy');
            return false;
        },

        toggleAllComplete: function () {
            let done = this.allCheckbox.checked;
            Todos.each(function (todo) { todo.save({'done': done}); });
        }

    });

    // Finally, we kick things off by creating the **App**.
    let App = new AppView;
});
