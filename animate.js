'use strict';

// https://gist.github.com/joelambert/1002116
const requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

const requestTimeout = function(fn, delay) {
  if (
    !window.requestAnimationFrame  &&
    !window.webkitRequestAnimationFrame &&
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame &&
    !window.msRequestAnimationFrame
  ) return window.setTimeout(fn, delay);

  const start = new Date().getTime();
  const handle = {};

  function loop() {
    const current = new Date().getTime();
    const delta = current - start;

    if (delta >= delay) {
      fn.call();
    } else {
      handle.value = requestAnimFrame(loop);
    }
  }

  handle.value = requestAnimFrame(loop);
  return handle;
};

window.animate = function(packedImage, delayScale, data, canvasElement) {
  const { w, h, frames } = data;
  canvasElement.width = w;
  canvasElement.height = h;

  let i = 0;

  let paused = false;

  const drawNextFrame = () => {
    if (paused)
      return;

    const frame = i++ % frames.length;
    const delay = frames[frame].delay * delayScale;
    const blits = frames[frame].blit;

    const ctx = canvasElement.getContext('2d');

    for (let j = 0; j < blits.length; ++j) {
      const [ sx, sy, w, h, dx, dy ] = blits[j];
      ctx.drawImage(packedImage, sx, sy, w, h, dx, dy, w, h);
    }

    requestTimeout(drawNextFrame, delay);
  };

  drawNextFrame();

  return {
    isPaused() {
      return paused;
    },

    setPaused(p) {
      const oldPaused = paused;
      paused = p;
      if (oldPaused && !paused)
        drawNextFrame();
    }
  };
};
