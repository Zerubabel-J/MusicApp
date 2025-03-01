function checkPassword() {
        
    const correctPassword = "Dreamstate"; // Set your password here
    let userInput;

    while (true) {
      userInput = prompt("Enter the password:");
   
      if (userInput === correctPassword) {
        document.querySelector(".container").style.display = "flex"; // Redirect on success
        break;
      } else if (userInput === null) {
        alert("Access denied! Closing page.");
        window.close(); // Close the page if the user cancels
        break;
      } else {
        alert("Incorrect password. Try again.");
      }
    }
  }

  let currentAudio = null; // Track currently playing audio

  function playAudio(audioId) {
    let newAudio = document.getElementById(audioId);

    // Stop and reset any currently playing audio
    if (currentAudio && currentAudio !== newAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset to beginning
    }

    // Play new audio
    newAudio.play();
    currentAudio = newAudio;
  }