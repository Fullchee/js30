// we don't set it as const because we have multiple timers
let counter;
const timerDisplay = document.querySelector('.display__time-left');
const endTimeDisplay = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  const start = Date.now();
  const end = start + seconds * 1000;
  const secondsLeft = (end - start) / 1000;
  displayTime(secondsLeft);
  showEndingTime(secondsLeft);

  counter = setInterval(() => {
    const secondsLeft = (end - Date.now()) / 1000;
    if (secondsLeft < 0) {
      clearInterval(counter);
    }
    displayTime(secondsLeft);
  }, 1000);

}

function displayTime(secondsLeft) {

  let minutes = Math.floor(secondsLeft / 60);
  let seconds = Math.round(secondsLeft % 60);
  if (minutes < 0) {
    minutes = 0;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  const display = `${minutes}:${seconds}`;
  timerDisplay.textContent = display;
}

function showEndingTime(secondsLeft) {
  const endTime = new Date(Date.now() + secondsLeft * 1000);
  // I like how Wes only uses consts here
  let endHour = endTime.getHours();
  let ampm = 'AM';
  if (endHour > 12) {
    endHour -= 12;
    ampm = 'PM';
  }
  if (endHour === 0) {
    endHour = 12;
  }
  endTimeDisplay.textContent = `Be back at ${endHour}:${endTime.getMinutes() < 10 ? '0' : ''}${endTime.getMinutes()} ${ampm}`;
}

buttons.forEach((button) =>
  button.addEventListener('click', function(e) {
    clearInterval(counter);
    timer(this.dataset.time);
  })
);

// if element has a name, you can select like this
// it doesn't have to be unique (will return an array)
document.customForm.addEventListener('submit', function(e){
  e.preventDefault();
  console.log(e);
  // name attribute of the input
  console.log(this.minutes.value);
  clearInterval(counter);
  timer(this.minutes.value * 60);
  this.reset();
});
