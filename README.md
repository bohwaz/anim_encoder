# Animation Encoder

This is a fork of anim_encoded from [sublimehq](https://github.com/sublimehq/anim_encoder) and [aquach](https://github.com/aquach/anim_encoder).

See [this Reddit discussion](https://www.reddit.com/r/web_design/comments/3gw1i9/finally_mobile_friendly_nongif_animations/) for details.

This includes changes to make this work with Python3 on Debian Bullseye.

This also generates a WebP image that you can serve when the browser accepts it, increasing the size gain.

## Requirements

`sudo apt install pngcrush python3-opencv python3-numpy python3-scipy python3-progressbar python3-imageio slop ffmpeg imagemagick webp`

## Workflow

1. `./record.rb <animation_name>` to generate a bunch of PNGs in the current directory. When running record, you'll select a rectangle that will be captured by ffmpeg.
2. Delete, trim, or modify the generated PNGs as necessary.
3. `./animate.rb <animation_name>` invokes the encoder, which sucks up all the PNGs and outputs two files: a packed PNG file, and a JS file that exports the draw data in order to draw the animation.
4. Include the JS file in your code and the `animate.js` file in the current directory.
5. Invoke the animate function.

## Example
Here's an example snippet that animates `animation.js` at a rate of 15 ms per frame against the first canvas in the DOM. You'll want to plug in your real animation values and URL.

```javascript
const myAnimation = require('./animation');
const animate = require('./animate');

const delayScale = 15;

const img = new Image();
img.onload = () => {
  animate(img, delayScale, myAnimation, document.getElementByTag('canvas')[0]);
};
img.src = '<url>';
```

## Credit

sublimehq for doing the heavy lifting. We just made it easier to use.
