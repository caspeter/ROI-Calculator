(function() {

  'use strict';

  angular.module("app").component("revenue", {
    controller: RevenueController,
    templateUrl: './revenue/revenue.template.html'
  })

  function RevenueController() {
    var vm = this;

    vm.$onInit = onInit;
    vm.submitNewRevenue = submitNewRevenue;
    vm.submitNewExpense = submitNewExpense;

    function onInit() {
      console.log('Loaded');
      vm.revenues = [];
      vm.newRev = {};
      vm.newExpense = {};
      vm.totalOneTimeRevenue = 0;
      vm.totalMonthlyRevenue = 0;
      vm.totalOneTimeExpense = 0;
      vm.totalMonthlyExpense = 0;
      vm.allRev = [
        {
          description: 'text',
          oneTime: 23,
          monthly: 45
        }, {
          description: 'text',
          oneTime: 23,
          monthly: 45
        }
      ];
      vm.allExpense = [
        {
        description: 'expense1',
        oneTime: 20,
        monthly: 40
      }, {
        description: 'expense2',
        oneTime: 20,
        monthly: 40
      }];
    }

    function submitNewRevenue() {
      vm.allRev.push(vm.newRev);
      console.log(vm.allRev);
      vm.newRev = {};
      recalculateTotals();
    }

    function submitNewExpense() {
      vm.allExpense.push(vm.newExpense);
      console.log(vm.allExpense);
      vm.newExpense = {};
      recalculateTotals();
    }


    function calculateTotals(array, frequency){
      let total = 0;
      for (var i = 0; i < array.length; i++) {
        total += array[i][frequency];
        console.log(total);
      }
      return total;
    };

    function recalculateTotals() {
      vm.totalOneTimeExpense = calculateTotals(vm.allExpense, 'oneTime');
      vm.totalMonthlyExpense = calculateTotals(vm.allExpense, 'monthly');
      vm.totalOneTimeRevenue = calculateTotals(vm.allRev, 'oneTime');
      vm.totalMonthlyRevenue = calculateTotals(vm.allRev, 'monthly');
    }

  }
})();
