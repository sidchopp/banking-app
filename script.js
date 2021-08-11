'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  // to display 'none' or 'empty page' initially before we push in the values from some account
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov} €</div>
     </div>
    `;
    // to attach the above html onto the webpage
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
};
// calling the above function for 'account1' object and its 'movement' property
// we are not calling this function here but with LogIn button, so commenting it
//displayMovements(account1.movements);

// to create a new property called "username" in each account

const createUsernames = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
//console.log(accounts);

const updateUi = function (acc) {
  // Display movements of that account
  displayMovements(acc.movements);

  //Display balance of that account
  calcDisplayBalance(acc);
  // Display summary of that account  
  // Here we have called the whole currentAccount beacuse if we go back to where we have defined this function, we will find that we have argument 'acc' in the 'calcDisplaySummary'
  calcDisplaySummary(acc);
}
// to add the values of movements in a an account and show te total on webpage

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // console.log(balance);
  labelBalance.textContent = `${acc.balance} €`;
};
// we are not calling this function here but with LogIn button, so commenting it
//calcDisplayBalance(account1.movements);


// here in summary we are not just taking movements but the entire account as interest rate in each account is different
const calcDisplaySummary = function (acc) {
  // to display deposited amount in an acount on webpage

  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = ` ${incomes} €`
  // to display thr total amount which goes out of an acoount

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // We take the absolue value of the negative total amount , hence used math.abs()
  labelSumOut.textContent = ` ${Math.abs(out)} €`

  // to calculate the interest of 1.2% ,say on each deposit and then get the total interest

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    // to include that interest is given ONLY when the deposited amount is atleast 1
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = ` ${interest} €`;
};
// we are not calling this function here but with LogIn button, so commenting it
//calcDisplaySummary(account1.movements);

// Event Handlers

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // to stop relaod of page, which is a default behaiour of a form or button, when we click, we give the function an event parameter say e and then we write below code (to prevent form from submitting just on click) 
  e.preventDefault();

  // to matchthe account owner with the actual user input value

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  //console.log(currentAccount);

  // to match the actual pin with the user input value we use if statement
  // we use optional chaining(?.) to make sure this if staement works only if the user input matches with one of the acoounts that actually exits
  // to convert the user input from a string(by defalut) into a number we used Number()
  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    // Display UI and welcome message with the "first name " of the account owner
    labelWelcome.textContent = ` Wecome back, ${currentAccount.owner.split(' ')[0]}!!`
    containerApp.style.opacity = 100;

    // clear the input fields after login
    inputLoginUsername.value = inputLoginPin.value = '';
    // to update UI
    updateUi(currentAccount);
  }
});

// Transfer money from one account to another

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  //console.log(amount, receiverAcc);
  // to clean the input fields after transaction
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {

    // Doing the tranfer from sender to receiver
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // to update UI
    updateUi(currentAccount);
  }


})










