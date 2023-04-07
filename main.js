// ! elementlere ulasma ve yakalama
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");
const closeButton = document.getElementById("close-button");
// butonlar
const songImage = document.getElementById("song-image");
const songArtist = document.getElementById("song-artist");
const songName = document.getElementById("song-name");
// sarki objeleri
const audio = document.getElementById("audio");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const currentProgress = document.getElementById("current-progress");
const progressBar = document.getElementById("progress-bar");
// sürec ve zamanalama

const playListContainer = document.getElementById("playlist-container");
const playListSongs = document.getElementById("playlist-songs");
// playlist

// ! sarki icerikleri indis
let index;

// !dongu
let loop = true;

// ! sarki listesi
const songsList = [
  {
    name: "sevecek sandim",
    link: "sounds/sevecek sandim.mp3",
    artist: "semi-cenk",
    image: "images/semi.png",
  },
  {
    name: "Askin olayim",
    link: "sounds/askin olayim.mp3",
    artist: "Simge Sagin",
    image: "images/simge.png",
  },
  {
    name: "M.",
    link: "sounds/M..mp3",
    artist: "Anil Emre Daldal",
    image: "images/m.png",
  },
  {
    name: "Askin olayim",
    link: "sounds/askin olayim.mp3",
    artist: "Simge Sagin",
    image: "images/simge.png",
  },
  {
    name: "Calm Down",
    link: "sounds/Calm down.mp3",
    artist: "Rema",
    image: "images/rema.png",
  },
];
// ! olaylar
let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent"); // dokunmatik cihazlar icin
    deviceType = "touch";
    return true;
  } catch (event) {
    deviceType = "mouse";
    return false;
  }
};

// !zaman formatlama
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return ` ${minute}: ${second}`;
};

// ! sarki atama
const setSong = (arrayIndex) => {
  console.log(arrayIndex);
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  // metadata yuklendiginde sureyi goster
  audio.onloadeddata = () => {
    maxDuration.innerText = timeFormatter(audio.duration); //sarkinin  sn cinsinden süresi
  };
  playListContainer.classList.add("hide");
  playAudio();
};

// !sarkiyi oynat
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); //gorun
  playButton.classList.add("hide"); //kaybol
};

// !tekrar et
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    console.log("tekrar kapatildi");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    console.log("tekrar acik");
  }
});
// ! siradaki sarkiya gecis
const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      //basa git
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
    playAudio();
  } else {
    // rastgele sira bul ve oynat
    let randIndex = Math.floor(Math.random() * songsList.length);
    console.log(randIndex);
    setSong(randIndex);
    playAudio();
  }
};
// !sarkiyi durdur!
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};
//!onceki sarkiya gec!
const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};
//!sarki bittiginde sonrakine gec!
audio.onended = () => {
  nextSong();
};

// ! shuffle songs
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("karistirma kapali");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("karistirma acik");
  }
});

// ! play button
playButton.addEventListener("click", playAudio);

// !next button
nextButton.addEventListener("click", nextSong);

// !pause Button
pauseButton.addEventListener("click", pauseAudio);
// ! prev button
prevButton.addEventListener("click", previousSong);

// ! cihaz tipi!
isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  //progress bar basla
  let coordStart = progressBar.getBoundingClientRect().left;

  // mouse ile click
  // false

  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  //! genisligi sürece ata
  currentProgress.style.width = progress * 100 + "%";

  //! zamani ata
  audio.currentTime = progress * audio.duration;

  //! oynat
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

//! süreci zamana gore guncelle
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

// !zamani guncelle
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

// ! playlist olustur!
const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += ` <li class= "playlistSong"
    onclick="setSong(${i})">
    <div class="playlist-image-container">
    <img src=" ${songsList[i].image}"/>
    </div>
    <div class="playlist-song-details">
    <span id="playlist-song-name">
    ${songsList[i].name} 
    </span>
    </div>
    </li>
    `;
  }
};

// !sarki listesini goster
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

// ! sarki listesini kapat
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//!ekran yuklenirken
window.onload = () => {
  //baslangic sarki sirasi
  index = 0;
  setSong(index);
  pauseAudio();
  //!playlist olustur
  initializePlaylist();
};
