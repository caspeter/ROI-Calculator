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
    vm.removeLine = removeLine;
    vm.resetInput = resetInput;
    vm.resetErrors = resetErrors;

    function onInit() {
      console.log('Loaded');
      vm.easterEgg = false;
      vm.revenues = [];
      vm.newRev = {description: null,
      oneTime: null,
      monthly: null};
      vm.newExpense = {description: null,
      oneTime: null,
      monthly: null};
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
      vm.revenueErrors = {
        description: false,
        atLeastOne: false,
        correctInput: false
      };
      vm.expenseErrors = {
        description: false,
        atLeastOne: false,
        correctInput: false
      };
      vm.allRev = [
        {
          description: 'Revenue 1',
          oneTime: 100,
          monthly: 50
        }, {
          description: 'Revenue 2',
          oneTime: 50,
          monthly: 25
        }, {
          description: 'Revenue 3',
          oneTime: 25,
          monthly: 85
        }
      ];
      vm.allExpense = [
        {
          description: 'Expense 1',
          oneTime: 500,
          monthly: 20
        }, {
          description: 'Expense 2',
          oneTime: 200,
          monthly: 40
        }
      ];
      recalculate();
    }

    function checkValidNumber(number) {
      console.log('getting into checkValidNumber');
      let newNumber = parseInt(number);
      console.log(newNumber);
      const checkValid = /^\d*\.?\d{0,2}?$/;
      if (Number.isNaN(newNumber)) {
        return false;
      } else if (newNumber < 0 || newNumber > 1000000001) {
        return false;
      } else {
        console.log('making it into and out of checkValidNumber functon');
        console.log(checkValid.test(number), 'check against regex');
        return checkValid.test(number);
      };
    }

    function submitNewRevenue() {
      //if there isn't a description throw an error
      if (vm.newRev.description === undefined || vm.newRev.description == '' || vm.newRev.description.length <= 0) {
        vm.revenueErrors.description = true;
        vm.revenueErrors.atLeastOne = false;
      } else {
        vm.revenueErrors.description = false;
      };
      //if there isn't a number in either of the number entries throw an error
      if ((!vm.newRev.oneTime || vm.newRev.oneTime == '') && (!vm.newRev.monthly || vm.newRev.monthly == '')) {
        vm.revenueErrors.atLeastOne = true;
        vm.revenueErrors.correctInput = false;
      } else {
        vm.revenueErrors.atLeastOne = false;
        vm.revenueErrors.correctInput = false;
      };
      //there is a description and at least one number filled out
      if (vm.revenueErrors.description == false && vm.revenueErrors.atLeastOne == false) {
        vm.revenueErrors.correctInput = false;
        if (!vm.newRev.oneTime) {
          if (checkValidNumber(vm.newRev.monthly)) {
            vm.allRev.push({description: vm.newRev.description, oneTime: 0, monthly: vm.newRev.monthly});
            recalculate(vm.newRev);
          } else {
            vm.revenueErrors.correctInput = true;
          }
        } else if (!vm.newRev.monthly) {
          if (checkValidNumber(vm.newRev.oneTime)) {
            vm.allRev.push({description: vm.newRev.description, oneTime: vm.newRev.oneTime, monthly: 0});
            recalculate(vm.newRev);
          } else {
            vm.revenueErrors.correctInput = true;
          }
        } else {
          if (checkValidNumber(vm.newRev.monthly) && checkValidNumber(vm.newRev.oneTime)) {
            vm.allRev.push(vm.newRev);
            recalculate(vm.newRev);
          } else {
            vm.revenueErrors.correctInput = true;
          }
        };
      } else {
        vm.revenueErrors.correctInput = true;
      }
    }

    function submitNewExpense() {
      //if there isn't a description throw an error
      if (vm.newExpense.description === undefined || (vm.newExpense.description == '' || vm.newExpense.description.length <= 0)) {
        vm.expenseErrors.description = true;
        vm.expenseErrors.atLeastOne = false;
      } else {
        vm.expenseErrors.description = false;
      };
      //if there isn't a number in either of the number entries throw an error
      if ((!vm.newExpense.oneTime || vm.newExpense.oneTime == '') && (!vm.newExpense.monthly || vm.newExpense.monthly == '')) {
        vm.expenseErrors.atLeastOne = true;
        vm.expenseErrors.correctInput = false;
      } else {
        vm.expenseErrors.atLeastOne = false;
        vm.expenseErrors.correctInput = false;
      }
      //there is a description and at least one number filled out
      if (vm.expenseErrors.description == false && vm.expenseErrors.atLeastOne == false) {
        vm.expenseErrors.correctInput = false;
        if (!vm.newExpense.oneTime) {
          if (checkValidNumber(vm.newExpense.monthly)) {
            vm.allExpense.push({description: vm.newExpense.description, oneTime: 0, monthly: vm.newExpense.monthly});
            recalculate(vm.newExpense);
          } else {
            vm.expenseErrors.correctInput = true;
          }
        } else if (!vm.newExpense.monthly) {
          if (checkValidNumber(vm.newExpense.oneTime)) {
            vm.allExpense.push({description: vm.newExpense.description, oneTime: vm.newExpense.oneTime, monthly: 0});
            recalculate(vm.newExpense);
          } else {
            vm.expenseErrors.correctInput = true;
          }
        } else {
          if (checkValidNumber(vm.newExpense.monthly) && checkValidNumber(vm.newExpense.oneTime)) {
            vm.allExpense.push(vm.newExpense);
            recalculate(vm.newExpense);
          } else {
            vm.expenseErrors.correctInput = true;
          }
        };
      } else {
        vm.expenseErrors.correctInput = true;
      }
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

    function calculateTotals(array, frequency) {
      let total = 0;
      for (var i = 0; i < array.length; i++) {
        total += array[i][frequency];
      }
      return total;
    };

    function calculateMonthlyContributionProfit() {
      //Monthly Contribution Profit = Monthly Revenue – Monthly Expenses
      return vm.totalMonthlyRevenue - vm.totalMonthlyExpense;
    }

    function totalContributionProfit() {
      //Total Contribution Profit = Total Revenue – Total Expenses
      return (vm.totalRevenue - vm.totalExpense);
    }

    function calculateContributionMargin() {
      //Contribution Margin = Total Contribution Profit / Total Revenue
      if (vm.totalRevenue == 0) {
        return 0;
      } else {
        return Math.round(vm.contributionProfit / vm.totalRevenue * 100);
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

    function recalculate(newItem) {
      vm.easterEgg = false;
      vm.totalOneTimeExpense = calculateTotals(vm.allExpense, 'oneTime');
      vm.totalMonthlyExpense = calculateTotals(vm.allExpense, 'monthly');
      vm.totalOneTimeRevenue = calculateTotals(vm.allRev, 'oneTime');
      vm.totalMonthlyRevenue = calculateTotals(vm.allRev, 'monthly');
      vm.totalRevenue = (vm.totalMonthlyRevenue * 12) + vm.totalOneTimeRevenue;
      vm.totalExpense = (vm.totalMonthlyExpense * 12) + vm.totalOneTimeExpense;
      vm.monthlyContributionProfit = calculateMonthlyContributionProfit();
      vm.contributionProfit = totalContributionProfit();
      vm.contributionMargin = Math.round(calculateContributionMargin() * 100) / 100;
      vm.capitalROI = Math.round(calculateCapitalROI() * 10) / 10;
      if (newItem == vm.newRev) {
        vm.newRev = {
          description: null,
          oneTime: null,
          monthly: null
        };
      } else if (newItem == vm.newExpense) {
        vm.newExpense = {description: null,
        oneTime: null,
        monthly: null};
      }
    }

    function resetErrors(errorSet) {
      if (errorSet == 'expense') {
        vm.expenseErrors = {
          description: false,
          atLeastOne: false,
          correctInput: false
        };
      } else {
        vm.revenueErrors = {
          description: false,
          atLeastOne: false,
          correctInput: false
        };
      }
    }

    function resetInput(whichForm) {
      if (whichForm == 'expense') {
        vm.newExpense = {};
      } else {
        vm.newRev = {};
      }
      vm.resetErrors(whichForm)
    }

  }
})();
