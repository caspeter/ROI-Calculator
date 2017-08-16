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
          description: 'text1',
          oneTime: 100,
          monthly: 50
        }, {
          description: 'text2',
          oneTime: 50,
          monthly: 25
        }, {
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
        }
      ];
      recalculate();
    }

    function checkValidNumber(number) {
      console.log('getting here');
      let newNumber = parseInt(number);
      console.log(newNumber);
      const checkValid = /^\d*\.?\d{0,2}$/;
      if (newNumber == NaN || newNumber < 0 || newNumber > 1000000001) {
        return false;
      } else if (number == null) {
        return true;
      }
      else {
        console.log('making it into and out of checkValidNumber functon');
        console.log(vm.newRev);
        console.log(checkValid.test(newNumber), 'check against regex');
        return checkValid.test(newNumber);
      };
    }

    function submitNewRevenue(newItem) {
      // console.log(newItem);
      //if there isn't a description throw an error
      if (newItem.description === undefined || newItem.description == '' || newItem.description.length <= 0) {
        vm.revenueErrors.description = true;
      } else {
        vm.revenueErrors.description = false;
      };
      //if there isn't a number in either of the number entries throw an error
      if ((!newItem.oneTime || newItem.oneTime == '') && (!newItem.monthly || newItem.monthly == '')) {
        vm.revenueErrors.atLeastOne = true;
        vm.revenueErrors.correctInput = false;
      } else {
        vm.revenueErrors.atLeastOne = false;
        vm.revenueErrors.correctInput = false;
      };
      //there is a description and at least one number filled out
      if (vm.revenueErrors.description == false && vm.revenueErrors.atLeastOne == false && checkValidNumber(newItem.monthly) && checkValidNumber(newItem.oneTime)) {
        vm.revenueErrors.correctInput = false;
        if (!newItem.oneTime) {
            vm.allRev.push({description: newItem.description, oneTime: 0, monthly: newItem.monthly});
        } else if (!newItem.monthly) {
            vm.allRev.push({description: newItem.description, oneTime: newItem.oneTime, monthly: 0});
        } else {
          vm.allRev.push(newItem);
        };
        recalculate(newItem);
      } else {
        vm.revenueErrors.correctInput = true;
      }
    }

    function submitNewExpense(newItem) {
      console.log(newItem);
      //if there isn't a description throw an error
      if (newItem.description === undefined || (newItem.description == '' || newItem.description.length <= 0)) {
        vm.expenseErrors.description = true;
      } else {
        vm.expenseErrors.description = false;
      };
      //if there isn't a number in either of the number entries throw an error
      if ((!newItem.oneTime || newItem.oneTime == '') && (!newItem.monthly || newItem.monthly == '')) {
        vm.expenseErrors.atLeastOne = true;
        vm.expenseErrors.correctInput = false;
      } else {
        vm.expenseErrors.atLeastOne = false;
        vm.expenseErrors.correctInput = false;
      }
      //there is a description and at least one number filled out
      if (vm.expenseErrors.description == false && vm.expenseErrors.atLeastOne == false && checkValidNumber(newItem.monthly) && checkValidNumber(newItem.oneTime)) {
        vm.expenseErrors.correctInput = false;
        if (!newItem.oneTime) {
            vm.allExpense.push({description: newItem.description, oneTime: 0, monthly: newItem.monthly});
        } else if (!newItem.monthly) {
            vm.allExpense.push({description: newItem.description, oneTime: newItem.oneTime, monthly: 0});
        } else {
            vm.expenseErrors.correctInput = false;
            vm.allExpense.push(newItem);
        };
        recalculate(newItem);
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
        vm.newRev = {};
      } else if (newItem == vm.newExpense) {
        vm.newExpense = {};
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
