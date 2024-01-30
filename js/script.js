const content = document.querySelector(".content"),
  Playimage = content.querySelector(".music-image img"),
  musicName = content.querySelector(".music-titles .name"),
  musicArtist = content.querySelector(".music-titles .artist"),
  Audio = document.querySelector(".main-song"),
  playBtn = content.querySelector(".play-pause"),
  playBtnIcon = content.querySelector(".play-pause span"),
  prevBtn = content.querySelector("#prev"),
  nextBtn = content.querySelector("#next"),
  progressBar = content.querySelector(".progress-bar"),
  progressDetails = content.querySelector(".progress-details"),
  repeatBtn = content.querySelector("#repeat"),
  Shuffle = content.querySelector("#shuffle");

// Add the following line at the beginning of your script.js file
const body = document.body;

let index = 1;

window.addEventListener("load", () => {
  loadData(index);
});

function loadData(indexValue) {
  musicName.innerHTML = songs[indexValue - 1].name;
  musicArtist.innerHTML = songs[indexValue - 1].artist;
  Playimage.src = "images/" + songs[indexValue - 1].img + ".jpg";
  Audio.src = "music/" + songs[indexValue - 1].audio + ".mp3";

  // Dynamically change background
  const backgroundUrl = songs[indexValue - 1].background;
  body.style.backgroundImage = backgroundUrl;

  // Dynamically change text color
  const textColor = songs[indexValue - 1].textColor;
  musicName.style.color = textColor;
  musicArtist.style.color = textColor;

  // Dynamically change thumbnail outer shadow color
  // const outerShadowColor = `rgba(0, 0, 0, 0.15)`;
  Playimage.style.boxShadow = `0px 0px 2px 1px ${textColor}, 0px 0px 14px 2px ${textColor}`;

  // Dynamically change control button colors
  const controlButtons = document.querySelectorAll(".control-btn span");
  controlButtons.forEach((button) => {
    button.style.color = textColor;
    button.style.boxShadow = `-4px -1px 0px -1px rgba(0,0,0,0.15), 1px 1px 2px 0px ${textColor}`;

    // Add event listener for :active state
    button.addEventListener("mousedown", () => {
      button.style.boxShadow = `inset 6px 6px 10px -1px rgba(0,0,0,0.15),
      inset -6px -6px 10px -1px ${textColor}`;
    });

    // Reset styles on mouseup
    button.addEventListener("mouseup", () => {
      button.style.boxShadow = `inset 6px 6px 10px -1px rgba(0,0,0,0.15),
      inset -6px -6px 12px -1px ${textColor}`;
    });
  });

  // Dynamically change progress bar color
  const progressDetails = document.querySelector(".progress-details");
  progressDetails.style.backgroundColor = textColor;

  // Dynamically change Now Playing text color
  const nowPlayingText = document.querySelector(".top-bar span:nth-child(2)");
  nowPlayingText.style.color = textColor;

  const timeText = document.querySelector(".time");
  timeText.style.color = textColor;

  const materialSymbolsRounded = document.querySelector(
    ".material-symbols-rounded"
  );
  materialSymbolsRounded.style.color = textColor;

  const materialSymbolsRoundedTopBar = document.querySelector(".top-bar");
  materialSymbolsRoundedTopBar.style.color = textColor;
}

playBtn.addEventListener("click", () => {
  const isMusicPaused = content.classList.contains("paused");
  if (isMusicPaused) {
    pauseSong();
  } else {
    playSong();
  }
});

function playSong() {
  content.classList.add("paused");
  playBtnIcon.innerHTML = "pause";
  Audio.play();
}

function pauseSong() {
  content.classList.remove("paused");
  playBtnIcon.innerHTML = "play_arrow";
  Audio.pause();
}

nextBtn.addEventListener("click", () => {
  nextSong();
});

prevBtn.addEventListener("click", () => {
  prevSong();
});

function nextSong() {
  index++;
  if (index > songs.length) {
    index = 1;
  } else {
    index = index;
  }
  loadData(index);
  playSong();
}

function prevSong() {
  index--;
  if (index <= 0) {
    index = songs.length;
  } else {
    index = index;
  }
  loadData(index);
  playSong();
}

Audio.addEventListener("timeupdate", (e) => {
  const initialTime = e.target.currentTime; // Get current music time
  const finalTime = e.target.duration; // Get music duration
  let BarWidth = (initialTime / finalTime) * 100;
  progressBar.style.width = BarWidth + "%";

  progressDetails.addEventListener("click", (e) => {
    let progressValue = progressDetails.clientWidth; // Get width of Progress Bar
    let clickedOffsetX = e.offsetX; // get offset x value
    let MusicDuration = Audio.duration; // get total music duration

    Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration;
  });

  //Timer Logic
  Audio.addEventListener("loadeddata", () => {
    let finalTimeData = content.querySelector(".final");

    //Update finalDuration
    let AudioDuration = Audio.duration;
    let finalMinutes = Math.floor(AudioDuration / 60);
    let finalSeconds = Math.floor(AudioDuration % 60);
    if (finalSeconds < 10) {
      finalSeconds = "0" + finalSeconds;
    }
    finalTimeData.innerText = finalMinutes + ":" + finalSeconds;
  });

  //Update Current Duration
  let currentTimeData = content.querySelector(".current");
  let CurrentTime = Audio.currentTime;
  let currentMinutes = Math.floor(CurrentTime / 60);
  let currentSeconds = Math.floor(CurrentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  currentTimeData.innerText = currentMinutes + ":" + currentSeconds;

  //repeat button logic
  repeatBtn.addEventListener("click", () => {
    Audio.currentTime = 0;
  });
});

//Shuffle Logic
Shuffle.addEventListener("click", () => {
  var randIndex = Math.floor(Math.random() * songs.length) + 1; // Select random betwn 1 and song array length
  loadData(randIndex);
  playSong();
});

Audio.addEventListener("ended", () => {
  index++;
  if (index > songs.length) {
    index = 1;
  }
  loadData(index);
  playSong();
});
