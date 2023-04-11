const audioFileInput = document.getElementById("audioFile");
const convertButton = document.getElementById("convertButton");
const transcriptionTextarea = document.getElementById("transcription");

convertButton.addEventListener("click", () => {
  if (audioFileInput.files.length === 0) {
    alert("Please select an audio file.");
    return;
  }

  const audioFile = audioFileInput.files[0];
  const audioBlobUrl = URL.createObjectURL(audioFile);

  const recognizer = new webkitSpeechRecognition();
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.lang = "en-US";
  recognizer.start();

  recognizer.onresult = (event) => {
    let interimTranscription = "";
    let finalTranscription = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const isFinal = result.isFinal;
      const transcription = result[0].transcript;

      if (isFinal) {
        finalTranscription += transcription;
      } else {
        interimTranscription += transcription;
      }
    }

    transcriptionTextarea.value = finalTranscription;
  };

  recognizer.onend = () => {
    URL.revokeObjectURL(audioBlobUrl);
  };

  recognizer.onerror = (event) => {
    alert("Error occurred during transcription: " + event.error);
  };

  recognizer.onnomatch = () => {
    alert("No transcription matches were found.");
  };

  recognizer.onstart = () => {
    alert("Transcription started. Please speak into your microphone.");
  };

  recognizer.start();
});
