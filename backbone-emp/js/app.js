var directory = {

    views: {},

    models: {},

    loadTemplates: function (views, callback) {

        var deferreds = [];

        $.each(views, function (index, view) {
            if (directory[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function (data) {
                    directory[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

directory.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "contact": "contact",
        "employees/:id": "employeeDetails",
        "orgChart": "orgChart"
    },

    initialize: function () {
        directory.shellView = new directory.ShellView();
        $('body').html(directory.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#content");
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!directory.homelView) {
            directory.homelView = new directory.HomeView();
            directory.homelView.render();
        } else {
            console.log('reusing home view');
            directory.homelView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(directory.homelView.el);
        directory.shellView.selectMenuItem('home-menu');
    },

    contact: function () {
        if (!directory.contactView) {
            directory.contactView = new directory.ContactView();
            directory.contactView.render();
        }
        this.$content.html(directory.contactView.el);
        directory.shellView.selectMenuItem('contact-menu');
    },

    employeeDetails: function (id) {
        var employee = new directory.Employee({id: id});
        var self = this;
        employee.fetch({
            success: function (data) {
                console.log(data);
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                self.$content.html(new directory.EmployeeView({model: data}).render().el);
            }
        });
        directory.shellView.selectMenuItem();
    },

    orgChart: function () {
        /*var orgChart = new directory.EmployeeCollection();
        orgChart.fetch({data: {name: ""}});*/
        directory.orgChartView = new directory.OrgChartView();
        directory.orgChartView.render();

        this.$content.html(directory.orgChartView.el);

        //this.$content.html(directory.orgChartView.el);
        directory.shellView.selectMenuItem('org-chart');

        /*employee.fetch({
            success: function (data) {
                self.$content.html(new directory.EmployeeOrgView({model: data}).render().el);
            }
        });*/
    }

});

$(document).on("ready", function () {
    directory.loadTemplates(["HomeView", "ContactView", "ShellView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView", "EmployeeOrgView"],
        function () {
            directory.router = new directory.Router();
            Backbone.history.start();
        });
});
