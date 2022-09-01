
# Stable-difussion-js

Allows to create images from a given text using the stable-diffusion sdk




## Pre requirements

You must have python 3 previously installed, once you have python, you must install the stable-diffusion sdk and Pillow

```bash
  pip install stability_sdk Pillow
```

Additionally, you must have the API_KEY obtained from the [dreamstudio](https://beta.dreamstudio.ai/membership) website

## Installation

Install stable-difussion-js with npm

```bash
  npm install stable-difussion-js
```


## Usage/Examples

Create an image in base64 format

```javascript
const stableDiffusion = require('stable-difussion-js');
const SD = new stableDiffusion('YOUR_API_KEY_HERE');

// Get image in base64
SD.makeImage({
    search: 'a floating boat in a forest with studio ghibli style',
})
.then(data => {
    console.log('Image', data);
})
.catch(err => {
    console.log('Error', err);
})
```

Create an image with multiples API_KEY

```javascript
const stableDiffusion = require('stable-difussion-js');
const SD = new stableDiffusion(['YOUR_API_KEY_HERE', 'YOUR_API_KEY_2_HERE', 'YOUR_API_KEY_N_HERE']);

// Get image in base64
SD.makeImage({
    search: 'a floating boat in a forest with studio ghibli style',
})
.then(data => {
    console.log('Image', data);
})
.catch(err => {
    console.log('Error', err);
})
```

Create an image and store it locally

```javascript
const stableDiffusion = require('stable-difussion-js');
const path = require('path');
const SD = new stableDiffusion('YOUR_API_KEY_HERE');

// Get image in base64
SD.makeImage({
    search: 'a floating boat in a forest with studio ghibli style',
    outputPath: path.join(__dirname, 'img')
})
.then(data => {
    console.log('Image', data);
})
.catch(err => {
    console.log('Error', err);
})
```

Response

```javascript
{
  status: 'sucess',
  fileName: 'ff622f9af4da4e79a43eeb7806f48186.jpeg',
  file: 'PATH_TO_FILE\ff622f9af4da4e79a43eeb7806f48186.jpeg'
}
```