(function() {

    'use strict';

    angular
        .module("app")
        .component("revenue", {
            controller: RevenueController,
            templateUrl: './revenue/revenue.template.html'
        })

    function RevenueController() {
        var vm = this;

        //on start do this
        vm.$onInit = function() {
          console.log('Loaded');
        }


    }
})();
