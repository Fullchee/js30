const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;  // updated syntax
      video.play();
    })
    .catch(err => {
      alert("Please enable access to the webcam!");
      console.error(`Please `, err);
    });
}

function paintToCanvas() {
  // set canvas size to match the dimensions of the webcam
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // extract pixels
    let pixels = ctx.getImageData(0, 0, width, height);
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 100);
}

// no event listener needed, button already has onclick attribute
function takePhoto() {
  // snap: the audio from wesbos.com, the camera "snap" sound
  snap.currentTime = 0;
  snap.play();

  // take data out from canvas
  // jpeg because PNG is only more efficient for very few colors
  const data = canvas.toDataURL('image/jpeg');  // blob: base64, binary img


  const link = document.createElement('a');
  link.href = data;  // link to the binary jpeg
  link.setAttribute('download', 'webcam-photo');  // don't need to give the file type, the blob says it's already jpg
  link.innerHTML = `<image src="${data}" alt="Webcam Image" />`;
  strip.appendChild(link);
}

getVideo();

// video can emit canplay
// webcam -> video ->
video.addEventListener('canplay', paintToCanvas);


// -------------- Filters!
// get canvas pixels
function redEffect(pixels) {
  // += 4: rgba, pixels is a special type of array
  // no map, special array that doesn't have it
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
    // don't change the alpha for red effect
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 500] = pixels.data[i + 0];
    pixels.data[i + 100] = pixels.data[i + 1];
    pixels.data[i + 500] = pixels.data[i + 2];
    // when it's symmetrical, my hair becomes purple and my yellow shirt becomes green!
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
