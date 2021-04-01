import Backbone from "backbone";
import _ from "underscore";

let SingleTodoView = Backbone.View.extend({
//  template: _.template($('#singletodo-template').html()), don't work
    events: {
        "click .destroy" : "destroy",
        "click #done" : "toggle"
    },
    tagName: "tr",
    initialize: function () {
        this.template = _.template($('#singletodo-template').html());
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

export default SingleTodoView;
