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
      const checkValid = /^\d*\.?\d{0,2}$/;
      if (number.includes('e')) {
        return false;
      }
      return checkValid.test(number);
    }

    function submitNewItem(location, newItem) {
      //if it is revenue
      if (newItem == vm.newRev) {
        console.log('it is revenue');
        //if there isn't a description throw an error
        if (newItem.description === undefined || (newItem.description == '')) {
          vm.revenueErrors.description = true;
          console.log('nothing in description');
        } else {
          console.log('something in description');
          vm.revenueErrors.description = false;
        }
        //if there isn't a number in either of the number entries throw an error
        if ((!newItem.oneTime || newItem.oneTime == '') && (!newItem.monthly || newItem.monthly == '')) {
          console.log('nothing in either number inputs');
          vm.revenueErrors.atLeastOne = true;
          vm.revenueErrors.correctInput = false;
        } else {
          console.log('something in at least one input');
          vm.revenueErrors.atLeastOne = false;
        }
        //there is a description and at least one number filled out
        if (vm.revenueErrors.description == false && vm.revenueErrors.atLeastOne == false) {
          if (!newItem.oneTime) {
            console.log('there is no one time input');
            if (checkValidNumber(newItem.monthly)) {
              console.log('should be a valid input in monthly');
              vm.revenueErrors.correctInput = false;
              location.push({
                description: newItem.description,
                oneTime: 0,
                monthly: newItem.monthly})
                recalculate(newItem);
            } else {
              console.log('invalid input in monthly');
              vm.revenueErrors.correctInput = true;
            }
          } else if (!newItem.monthly) {
            if (checkValidNumber(newItem.oneTime)) {
              console.log('should be valid input in one time');
              vm.revenueErrors.correctInput = false;
              location.push({
                description: newItem.description,
                oneTime: newItem.oneTime,
                monthly: 0});
                recalculate(newItem);
            } else {
              console.log('not balid input in one time');
              vm.revenueErrors.correctInput = true;
            }
          } else {
            console.log('something in all three fields');
            if (checkValidNumber(newItem.oneTime) && checkValidNumber(newItem.monthly)) {
              console.log('something in all fields and values are valid');
              location.push(newItem);
              vm.revenueErrors.correctInput = false;
              recalculate(newItem);
            } else {
              console.log('there is an invalid value in one of the inputs');
              vm.revenueErrors.correctInput = true;
            }
          }
          // if (newItem == vm.newRev) {
          //   vm.newRev = {};
          // } else if (newItem == vm.newExpense) {
          //   vm.newExpense = {};
          // }
        }
        // EXPENSE ///////////////////////////
      } else {
        //if there isn't a description throw an error
        if (newItem.description === undefined || (newItem.description == '')) {
          vm.expenseErrors.description = true;
        } else {
          vm.expenseErrors.description = false;
        }
        //if there isn't a number in either of the number entries throw an error
        if ((!newItem.oneTime || newItem.oneTime == '') && (!newItem.monthly || newItem.monthly == '')) {
          vm.expenseErrors.atLeastOne = true;
        } else {
          vm.expenseErrors.atLeastOne = false;
        }

        //if everything is happy run this
        if (vm.expenseErrors.description == false && vm.expenseErrors.atLeastOne == false && vm.expenseErrors.correctInput == false) {
          if (!newItem.oneTime) {
            location.push({
              description: newItem.description,
              oneTime: 0,
              monthly: newItem.monthly})
          } else if (!newItem.monthly) {
            location.push({
              description: newItem.description,
              oneTime: newItem.oneTime,
              monthly: 0})
          } else {
            location.push(newItem);
            console.log(location);
          }
          if (newItem == vm.newRev) {
            vm.newRev = {};
          } else if (newItem == vm.newExpense) {
            vm.newExpense = {};
          }
          recalculate(newItem);
        }
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
      return parseInt(total.toFixed(2));
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

  }
})();
