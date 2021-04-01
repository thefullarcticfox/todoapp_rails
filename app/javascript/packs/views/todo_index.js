import Backbone from "backbone";
import _ from "underscore";
import SingleTodoView from "./singletodo";

let TodoIndexView = Backbone.View.extend({
//  template: _.template($('#todoindex-template').html()), don't work
    initialize: function () {
        this.template = _.template($('#todoindex-template').html());
        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch();
    },
    addOne: function (todo) {
        let view = new SingleTodoView({model: todo});
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

export default TodoIndexView;
