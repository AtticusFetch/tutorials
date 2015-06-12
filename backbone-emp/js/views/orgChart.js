directory.OrgChartView = Backbone.View.extend({
    tagName:"div",

    initialize: function () {
        this.orgEmployees = new directory.EmployeeCollection();
        this.orgEmployeesView = new directory.EmployeeOrgView({model: this.orgEmployees, className: 'tmp'});
    },

    render: function () {
        this.$el.html(this.template());
        $('.org-container', this.el).append(this.orgEmployeesView.render().el);
        return this;
    }

});

directory.EmployeeOrgView = Backbone.View.extend({
    tagName:"div",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        return this;
    }
});