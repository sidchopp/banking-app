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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT' // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US'
};



const accounts = [account1, account2];

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

// the 2nd parameter is setting the sort as false by default
const displayMovements = function (acc, sort = false) {
  // to display 'none' or 'empty page' initially before we push in the values from some account
  containerMovements.innerHTML = '';

  // to sort movements in ascending order
  // slice to create a shallow copy of movements( other wise sort will mutate it permanently)
  // now we are saying that is the sort parameter is true, then movs equal "movements.slice().sort((a, b) => a - b)" else movs =  movements( which by default means sort false)
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0); // As month is 0 based
    const year = date.getUTCFullYear();

    const displayDate = `${day}/${month}/${year}`;

    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
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
  displayMovements(acc);

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
  // to display the total amount which goes out of an acoount

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

// FAKE always logged in
currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;

// creating present date
const now = new Date();

// For day/month/year hour:minute format
// const day = now.getDate();
// to apply padstart on day and month
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0); // As month is 0 based
const year = now.getUTCFullYear();
const hour = now.getHours();
const minute = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;


btnLogin.addEventListener('click', function (e) {
  // to stop relaod of page, which is a default behaiour of a form or button, when we click, we give the function an event parameter say e and then we write below code (to prevent form from submitting just on click) 
  e.preventDefault();

  // to match the account owner with the actual user input value

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  //console.log(currentAccount);

  // to match the actual pin with the user input value we use if statement
  // we use optional chaining(?.) to make sure this if staement works only if the user input matches with one of the acoounts that actually exits
  // to convert the user input from a string(by defalut) into a number we used Number()
  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    // Display UI and welcome message with the "first name " of the account owner
    labelWelcome.textContent = ` Welcome back, ${currentAccount.owner.split(' ')[0]}!!`
    containerApp.style.opacity = 100;

    // clear the input fields after login
    inputLoginUsername.value = inputLoginPin.value = '';
    // to update UI
    updateUi(currentAccount);
  } else {
    labelWelcome.textContent = ` Username or Pin is INCORRECT!!`
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

    // Add tranfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // to update UI
    updateUi(currentAccount);
  }
});

// "Request Loan" button functionality

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  // using 'some' method to check if any movement amount is >= 10 percent of the loan amount the user is asking for
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);
    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    // update ui
    updateUi(currentAccount);
  }


  // to clean the input fields after transaction
  inputLoanAmount.value = '';
});

// "Close Account" Button functionalty

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    console.log(index);
    // to delete the account which matched with user inputs
    accounts.splice(index, 1)
    // after deleting that account, Hide UI
    containerApp.style.opacity = 0;
  };
  // to clean the input fields after deleting the account
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort in ascending order functionality
// to display the movements in an unsorted way when the page uploads initially

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // the 2nd parameter making sorted back to true when we click the sort button
  displayMovements(currentAccount, !sorted);
  // to make sure to flip the sort order EVERY time we click it
  sorted = !sorted;
})












