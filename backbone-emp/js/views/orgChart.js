directory.OrgChartView = Backbone.View.extend({
    render: function () {
        var self = this;
        for (var i = 1; i < directory.store.employees.length; i ++) {
            var employee = new directory.Employee({id: i});
            employee.fetch({
                success: function (data) {
                    self.$el.append(new directory.EmployeeOrgView({model: data}).render().el);
                }
            });
        }
        return this;
    }
});

directory.EmployeeOrgView = Backbone.View.extend({
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});