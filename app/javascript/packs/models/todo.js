import Backbone from "backbone";

let TodoModel = Backbone.Model.extend({
    urlRoot: '/todos',
    defaults: {
        title: "empty todo",
        done: false
    },
    toggle: function() {
        this.save({done: !this.get("done")});
    }
});

let TodoCollection = Backbone.Collection.extend({
    model: TodoModel,
    url: '/todos',
    comparator: 'created_at'
});

export default TodoCollection;
