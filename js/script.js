document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "Dreamstate";
  const passwordModal = document.getElementById("passwordModal");
  const passwordInput = document.getElementById("passwordInput");
  const submitPasswordBtn = document.getElementById("submitPassword");
  const errorMessage = document.getElementById("errorMessage");
  const container = document.querySelector(".container");

  if (localStorage.getItem("passwordEntered") === "true") {
    passwordModal.style.display = "none";
    container.style.display = "flex";
  } else {
    passwordModal.style.display = "flex";
    container.style.display = "none";
  }

  // Handle password submission
  submitPasswordBtn.addEventListener("click", () => {
    const userInput = passwordInput.value.trim();

    if (userInput === correctPassword) {
      localStorage.setItem("passwordEntered", "true");
      passwordModal.style.display = "none";
      container.style.display = "flex";
    } else {
      errorMessage.textContent = "Incorrect password. Try again.";
      errorMessage.style.display = "block";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      submitPasswordBtn.click();
    }
  });

  // Audio Player Logic
  let currentAudio = null; // Track currently playing audio
  let isPlaying = false;
  let currentTrackIndex = 0; // Track the current track index

  const tracks = [
    { id: "audio1", title: "PolyFuck", version: "Full Track" },
    { id: "audio2", title: "PolyFuck", version: "Vocals" },
    { id: "audio3", title: "PolyFuck", version: "Instrumental" },
    { id: "audio4", title: "Hey You", version: "Full Track" },
    { id: "audio5", title: "Hey You", version: "Vocals" },
    { id: "audio6", title: "Hey You", version: "Instrumental" },
    { id: "audio7", title: "Hello, comment vas-tu?", version: "Full Track" },
    { id: "audio8", title: "Hello, comment vas-tu?", version: "Vocals" },
    { id: "audio9", title: "Hello, comment vas-tu?", version: "Instrumental" },
  ];

  // Play the previous track
  function playPrevious() {
    if (currentTrackIndex > 0) {
      currentTrackIndex--;
    } else {
      currentTrackIndex = tracks.length - 1;
    }
    playAudio(tracks[currentTrackIndex].id);
  }

  // Play the next track
  function playNext() {
    if (currentTrackIndex < tracks.length - 1) {
      currentTrackIndex++;
    } else {
      currentTrackIndex = 0;
    }
    playAudio(tracks[currentTrackIndex].id);
  }

  // Play a specific track by ID
  function playAudio(audioId) {
    let newAudio = document.getElementById(audioId);
    const trackInfo = tracks.find((track) => track.id === audioId);

    if (currentAudio && currentAudio !== newAudio) {
      fadeOut(currentAudio, 500, () => {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        switchToNewAudio(newAudio, trackInfo);
      });
    } else {
      switchToNewAudio(newAudio, trackInfo);
    }
  }

  // Fade out the current audio
  function fadeOut(audio, duration, callback) {
    const fadeOutInterval = 50;
    const steps = duration / fadeOutInterval;
    const stepSize = audio.volume / steps;

    const fade = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume -= stepSize;
      } else {
        clearInterval(fade);
        callback();
      }
    }, fadeOutInterval);
  }

  // Switch to a new audio track
  function switchToNewAudio(newAudio, trackInfo) {
    currentAudio = newAudio;
    isPlaying = true;
    newAudio.volume = 1; // Reset volume
    newAudio.play();
    document.querySelector("#playPauseBtn i").classList.add("fa-pause");
    document.querySelector("#playPauseBtn i").classList.remove("fa-play");
    document.querySelector(".audio-controls").style.display = "flex";

    // Update track info
    document.querySelector(".track-title").textContent = trackInfo.title;
    document.querySelector(".track-version").textContent = trackInfo.version;

    newAudio.addEventListener("timeupdate", updateProgress);
    newAudio.addEventListener("ended", () => {
      isPlaying = false;
      document.querySelector("#playPauseBtn i").classList.remove("fa-pause");
      document.querySelector("#playPauseBtn i").classList.add("fa-play");
      document.querySelector(".audio-controls").style.display = "none";
    });
  }

  // Update the progress bar
  function updateProgress() {
    if (currentAudio && !currentAudio.paused) {
      const progress = currentAudio.currentTime / currentAudio.duration;
      document.getElementById("progressBar").value = progress;
      requestAnimationFrame(updateProgress);
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    if (currentAudio) {
      const playPauseIcon = document.querySelector("#playPauseBtn i");
      if (isPlaying) {
        currentAudio.pause();
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
      } else {
        currentAudio.play();
        playPauseIcon.classList.remove("fa-play");
        playPauseIcon.classList.add("fa-pause");
      }
      isPlaying = !isPlaying;
    }
  }

  // Seek to a specific position in the track
  function seekAudio(event) {
    if (currentAudio) {
      const progressContainer = document.querySelector(".progress-container");
      const rect = progressContainer.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;
      currentAudio.currentTime = currentAudio.duration * clickPosition;
    }
  }

  // Attach event listeners to audio controls
  document.querySelectorAll(".listitem").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const audioId = link.getAttribute("onclick").match(/'([^']+)'/)[1];
      playAudio(audioId);
    });
  });

  document
    .querySelector("#playPauseBtn")
    .addEventListener("click", togglePlayPause);
  document.querySelector("#prevBtn").addEventListener("click", playPrevious);
  document.querySelector("#nextBtn").addEventListener("click", playNext);
  document
    .querySelector(".progress-container")
    .addEventListener("click", seekAudio);
});
