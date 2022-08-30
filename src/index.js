const pythonBridge = require('python-bridge'); 
const fs = require("fs");
const path = require('path');

const randomUUI = (a,b) => {for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'');return b}

/**
 * stableDifussionJs class allows to create images from a given text using the stable-diffusion sdk.
 * 
 * @class stableDifussionJs
 * @see {@link https://github.com/Stability-AI/stability-sdk|Stability-sdk}
 */

class stableDifussionJs {
	constructor(apiKey) {
		if (typeof apiKey === 'string' && apiKey !== '') this.apiKey = [apiKey];
		else if (typeof apiKey === 'object' && Array.isArray(apiKey) && apiKey.length > 0) this.apiKey = apiKey;
		else this.apiKey = [];
	}

	/**
	 * Allows get random api_key
	 * 
	 * @return {string} API_KEY
	 */
	getApiKey() {
		return this.apiKey[Math.floor(Math.random()*this.apiKey.length)];
	}

	/**
	 * Allows you to make a image from text
	 * 
	 * @param {objet} args
	 * @param {string} args.search - Text to transform in image
	 * @param {string} args.outputPath - Path to output image
	 * @return {Promise<string>} Image in base64 format
	 */
	makeImage(args) {
		return new Promise((resolve, reject) => {
			if (!args.search) reject('Please enter a text to generate');
			else if (args.search === '' || args.search === null) reject('Please enter a text to generate');
			else if (this.apiKey.length === 0) reject('API_KEY not provided');
			else if (args.outputPath && (args.outputPath === '' || !fs.lstatSync(args.outputPath).isDirectory() )) reject('Please enter a valid outputPath');
			else {
				const python = pythonBridge();
				python.ex`
import base64
import io
from io import BytesIO
from PIL import Image
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation

def get_image(API_KEY, SEARCH):
	stability_api = client.StabilityInference(
		key=API_KEY,
		verbose=True,
	)

	answers = stability_api.generate(
		prompt=SEARCH
	)
	for resp in answers:
		for artifact in resp.artifacts:
			if artifact.finish_reason == generation.FILTER:
				return 'ERROR'
			if artifact.type == generation.ARTIFACT_IMAGE:
				buffered = BytesIO()
				img = Image.open(io.BytesIO(artifact.binary))
				img.save(buffered, format="JPEG")
				imgB64 = base64.b64encode(buffered.getvalue())
				return "data:image/jpeg;base64," + imgB64.decode()
`
				python`get_image(${this.getApiKey()}, ${args.search})`
				.then(data => {
					if (data === 'ERROR') reject('An error has occurred, please try again later');
					else {
						if (args.outputPath) {
							const fileName = `${ randomUUI() }.jpeg`;
							const file = path.join(args.outputPath, fileName);
							const base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
							fs.writeFile(file, base64Data, 'base64', (err) => {
								if (err) reject(err);
								else resolve({
									status: 'sucess',
									fileName: fileName,
									file: file,
								});
							});
						} else {
							resolve(data);
						}
					}
				})
				.catch(python.Exception, (err) => reject(err));

				python.end();
			}
		});
	}
}

module.exports = stableDifussionJs;