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