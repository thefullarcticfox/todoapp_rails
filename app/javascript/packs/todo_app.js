import Backbone from "backbone";
import TodoIndexView from "./views/indextodo";
import TodoNewView from "./views/newtodo";
import TodoShowView from "./views/showtodo";
import TodoEditView from "./views/edittodo";
import TodoCollection from "./models/todomodel";

let TodoRouter = Backbone.Router.extend({
    initialize: function() {
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
        this.view = new TodoIndexView({collection: this.todos})
        $("#todos").html(this.view.render().el)
    },
    newTodo: function () {
        this.view = new TodoNewView({collection: this.todos})
        $("#todos").html(this.view.render().el)
    },
    show: function (id) {
        let todo = this.todos.get(id);
        this.view = new TodoShowView({model: todo});
        $("#todos").html(this.view.render().el)
    },
    edit: function (id) {
        let todo = this.todos.get(id)
        this.view = new TodoEditView({model: todo})
        $("#todos").html(this.view.render().el)
    }
});

class TodoApp {
    constructor() {
        this.router = new TodoRouter;
        console.log(this.router);
        if (Backbone.History.started === false) {
            Backbone.history.start();
        }
    }
}

export default TodoApp;
