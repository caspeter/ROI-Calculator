(function() {

  'use strict';

  angular.module("app").component("revenue", {
    controller: RevenueController,
    templateUrl: './revenue/revenue.template.html'
  })

  function RevenueController() {
    var vm = this;

    vm.$onInit = onInit;
    vm.submitNewItem = submitNewItem;
    vm.removeLine = removeLine;

    function onInit() {
      console.log('Loaded');
      vm.revenues = [];
      vm.newRev = {};
      vm.newExpense = {};
      vm.totalOneTimeRevenue = 0;
      vm.totalMonthlyRevenue = 0;
      vm.totalRevenue = 0;
      vm.totalOneTimeExpense = 0;
      vm.totalMonthlyExpense = 0;
      vm.totalExpense = 0;
      vm.monthlyContributionProfit = 0;
      vm.contributionProfit = 0;
      vm.contributionMargin = 0;
      vm.capitalROI = 0;
      vm.allRev = [
        {
          description: 'text1',
          oneTime: 100,
          monthly: 50
        }, {
          description: 'text2',
          oneTime: 50,
          monthly: 25
        } ,{
          description: 'text3',
          oneTime: 25,
          monthly: 85
        }
      ];
      vm.allExpense = [
        {
        description: 'expense1',
        oneTime: 500,
        monthly: 20
      }, {
        description: 'expense2',
        oneTime: 200,
        monthly: 40
      }];
      recalculate();
    }

    function submitNewItem(location, newItem) {
      if (newItem.description === undefined) {
        console.log('error');
      } else if (!newItem.oneTime && !newItem.monthly) {
        console.log('money error');
      } else if (!newItem.oneTime) {
        console.log('no one time');
        location.push({
          description: newItem.description,
          oneTime: 0,
          monthly: newItem.monthly
        })
        location = {};
      } else if (!newItem.monthly) {
        console.log('no monthly');
        location.push({
          description: newItem.description,
          oneTime: newItem.oneTime,
          monthly: 0
        })
        location = {};
      } else {
        location.push(newItem);
        console.log(location);
      }
      if (newItem == vm.newRev) {
        vm.newRev = {};
      } else if (newItem == vm.newExpense) {
        vm.newExpense = {};
      }
      recalculate();
    }

    function removeLine(array, line) {
      let indexNumber = 0;
      for (var i = 0; i < array.length; i++) {
        if (array[i].description === line.description && array[i].oneTime === line.oneTime && array[i].monthly === line.monthly) {
          indexNumber = i;
        }
      }
      array.splice(indexNumber, 1);
      recalculate();
    }


    function calculateTotals(array, frequency){
      let total = 0;
      for (var i = 0; i < array.length; i++) {
        total += array[i][frequency];
      }
      return parseInt(total.toFixed(2));
    };

    function calculateMonthlyContributionProfit(){
      //Monthly Contribution Profit = Monthly Revenue – Monthly Expenses
      return vm.totalMonthlyRevenue - vm.totalMonthlyExpense;
    }

    function totalContributionProfit() {
      //Total Contribution Profit = Total Revenue – Total Expenses
      return (vm.totalRevenue - vm.totalExpense);
    }

    function calculateContributionMargin(){
      //Contribution Margin = Total Contribution Profit / Total Revenue
      if (vm.totalRevenue == 0) {
        return 0;
      } else {
        return Math.round(vm.contributionProfit/vm.totalRevenue * 100);
      }
    }

    function calculateCapitalROI() {
      //Capital ROI (Months) = (One-Time Expenses – One-Time Revenue) / Monthly Contribution Profit
      if (vm.monthlyContributionProfit == 0) {
        return 0;
      } else {
        return (vm.totalOneTimeExpense - vm.totalOneTimeRevenue) / vm.monthlyContributionProfit;
      }
    }

    function recalculate() {
      vm.totalOneTimeExpense = calculateTotals(vm.allExpense, 'oneTime');
      vm.totalMonthlyExpense = calculateTotals(vm.allExpense, 'monthly');
      vm.totalOneTimeRevenue = calculateTotals(vm.allRev, 'oneTime');
      vm.totalMonthlyRevenue = calculateTotals(vm.allRev, 'monthly');
      vm.totalRevenue = (vm.totalMonthlyRevenue*12) + vm.totalOneTimeRevenue;
      vm.totalExpense = (vm.totalMonthlyExpense*12) + vm.totalOneTimeExpense;
      vm.monthlyContributionProfit = calculateMonthlyContributionProfit();
      vm.contributionProfit = totalContributionProfit();
      vm.contributionMargin = Math.round(calculateContributionMargin() * 100)/100;
      vm.capitalROI = Math.round(calculateCapitalROI()*10)/10;
    }

  }
})();
