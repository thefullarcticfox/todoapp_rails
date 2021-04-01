import Backbone from "backbone";
import TodoIndexView from "./views/indextodo";
import TodoNewView from "./views/newtodo";
import TodoShowView from "./views/showtodo";
import TodoEditView from "./views/edittodo";
import TodoCollection from "./models/todo";

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
        this.view = new TodoIndexView({collection: this.todos});
        this.el.html(this.view.render().el);
    },
    newTodo: function () {
        this.view = new TodoNewView({collection: this.todos});
        this.el.html(this.view.render().el);
    },
    show: function (id) {
        let todo = this.todos.get(id);
        this.view = new TodoShowView({model: todo});
        this.el.html(this.view.render().el);
    },
    edit: function (id) {
        let todo = this.todos.get(id);
        this.view = new TodoEditView({model: todo});
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
