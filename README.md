# ROI Calculator

Code an ROI calculator using HTML5, Bootstrap and AngularJS (https://angularjs.org/) that looks like the following spreadsheet.   You may double click on the spreadsheet to open it and see the internal formulas.  The Add and Delete buttons are intended to add and remove revenue and expense items (note the buttons in the spreadsheet don't actually work; they are there for illustration purposes only).

All of the bold fields are calculated fields and should not be editable.  As additional revenue and expense items are added, the calculated fields should update automatically on the page.  As items are deleted, the calculated fields should also update automatically on the page.

The formulas are available in the spreadsheet, but reiterated here for clarity:

•	One-Time Revenue = Sum of the one-time column of all revenue items
•	Monthly Revenue = Sum of the monthly column of all revenue items
•	One-Time Expense = Sum of the one-time column of all expense items
•	Monthly Expense = Sum of the monthly column of all expense items

•	Total Revenue = One-Time Revenue + Monthly Revenue * 12
•	Total Expenses = One-Time Expense + Monthly Expenses * 12
•	Monthly Contribution Profit = Monthly Revenue – Monthly Expenses
•	Total Contribution Profit = Total Revenue – Total Expenses
•	Contribution Margin = Total Contribution Profit / Total Revenue
•	Capital ROI (Months) = (One-Time Expenses – One-Time Revenue) / Monthly Contribution Profit

The following are additional instructions for this exercise:

•	Use jsbin.com to do the development.  Submit results by providing a link on jsbin.com.  The solution must use AngularJS only.  Do not use jQuery. You may write AngularJS in CoffeeScript if you prefer.
•	See http://jsbin.com/mesozerafo/1/edit for a working AngularJS application example.
•	Use Bootstrap to give the page a professional, finished look.
•	Also make sure that all fields are formatted correctly: currency format, percentage format (for the Contribution Margin), and decimal format (for the Capital ROI).
