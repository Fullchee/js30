const player = document.querySelector(".player");
// cool tip: use existing elements, more performant!
const video = player.querySelector(".player__video");
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const playPause = player.querySelector("button.toggle");
// const skipButtons = Array.from(player.querySelectorAll(".player__button")).filter(button =>
//     button.hasAttribute("data-skip")
// );
const skipButtons = player.querySelectorAll("[data-skip"); // Wes' is more elegant
const sliders = player.querySelectorAll(".player__slider");
// -----------------------------------------


function togglePlay(e) {
  // switch icon
  // toggle playing the video
  // not playing, that's an event, paused is a property
  // if (video.paused) {
  //   video.play();
  // }
  // else {
  //   video.pause();
  // }

  // this is really cool. didn't know you could do this!
  const method = video.paused ? "play" : "pause";
  video[method]();

  // don't change toggle here!
}

function togglePlayIcon(e) {
  // wes: icon = ternary
  if (video.paused) {
    playPause.textContent = "►";
  }
  else {
    playPause.textContent = "❚❚";  // used nicer text
  }
}

// I don't need this, I can reuse a function
// function pauseHandler(e) {
//   playPause.textContent = "||";
// }

function handleSkip(e) {
  //
  // const seconds = parseInt(this.getAttribute("data-skip"));
  const seconds = parseInt(this.dataset.skip);
  console.log(seconds);
  console.log(video.currentTime);
  video.currentTime += seconds;
}

function handleSlide(e) {
  video[this.name] = this.value;
}

function handleProgress(e) {
  const percent = (this.currentTime / this.duration) * 100;
  // turn percent into flex-basis
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}
// -------------------- event listeners -----------------
video.addEventListener("click", togglePlay);
video.addEventListener("play", togglePlayIcon);
video.addEventListener("pause", togglePlayIcon);
video.addEventListener("timeupdate", handleProgress);
playPause.addEventListener("click", togglePlay);

skipButtons.forEach(button => button.addEventListener("click", handleSkip));

sliders.forEach(slider => slider.addEventListener("change", handleSlide));
// before letting go of the slider
sliders.forEach(slider => slider.addEventListener("mousemove", handleSlide));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
