const { compile } = require('nexe');
const path = require('path');

compile({
	input: path.resolve(__dirname, '../server.js'),
	build: true, //required to use patches
}).then(() => {
	console.log('success');
});