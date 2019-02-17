(function() {

  "use strict";

  const btn = document.getElementById("btn");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  }).then(_handleSuccess).catch(_handleError);
  
  function _handleSuccess(stream) {
    btn.addEventListener("click", () => {
      _handleClick(stream);
    }, false);
  }

  function _handleError() {
    alert("Error!");
  }

  function _handleClick(stream) {
    const LENGTH = 16;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const options  = {
      mediaStream : stream
    };
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser(stream);
    const data = new Uint8Array(LENGTH);
    let w = 0;

    btn.classList.add("off");
    analyser.fftSize = 1024;
    src.connect(analyser);

    setInterval(() => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = "#3e3e3e";

      w = canvas.width / LENGTH,

      analyser.getByteFrequencyData(data);

      for (let i = 0; i < LENGTH; ++i) {
        ctx.rect(i * w, canvas.height - data[i] * 2, w, data[i] * 2);
      }

      ctx.fill();
    }, 20);
  }
})();