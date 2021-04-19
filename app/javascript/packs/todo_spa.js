import Backbone from "backbone";
import TodoCollection from "./models/todo";
import TodoViews from "./views/todo_views";

let TodoRouter = Backbone.Router.extend({
    initialize: function(element) {
        this.el = element;
        this.todos = new TodoCollection;
    },
    routes: {
        "new"      : "newTodo",
        "index"    : "index",
        ":id/edit" : "edit",
        ":id"      : "show",
        ".*"       : "index"
    },
    index: function () {
        this.view = new TodoViews.IndexView({collection: this.todos});
        this.el.html(this.view.render().el);
    },
    newTodo: function () {
        this.view = new TodoViews.NewView({collection: this.todos});
        this.el.html(this.view.render().el);
    },
    show: function (id) {
        let todo = this.todos.get(id);
        this.view = new TodoViews.ShowView({model: todo});
        this.el.html(this.view.render().el);
    },
    edit: function (id) {
        let todo = this.todos.get(id);
        this.view = new TodoViews.EditView({model: todo});
        this.el.html(this.view.render().el);
    }
});

class TodoSPA {
    constructor() {
        this.router = new TodoRouter($("#todospa"));
        console.log(this.router);
        if (Backbone.History.started === false) {
            Backbone.history.start();
        }
    }
}

export default TodoSPA;
