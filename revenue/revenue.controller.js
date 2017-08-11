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

        vm.$onInit = onInit;
        vm.submitNewRevenue = submitNewRevenue;

        function onInit() {
          console.log('Loaded');
          vm.revenues= [];
          vm.newRev = {};
        }

        function submitNewRevenue(){
          console.log(vm.newRev);
        }

    }
})();
