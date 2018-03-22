const fs = require('fs-extra')
const { execSync } = require('child_process');
const compressor = require('node-minify');
const config = require('./webpack.config')

const copyToDist = [
	"react-another-dialog.js",
	"style.css",
]

const copyToExample = [
	"example.js",
	"example-style.css",
	"index.html",
]
 
try 
{
	console.log( "\t> webpack" )
	let stdout = execSync( "webpack" )

	for (let i=0; i < copyToDist.length; i++) 
	{
		const fname = copyToDist[i]

		console.log( "\tCopying "+fname )
		fs.copySync("dev/"+fname, 'dist/'+fname)

		compressor.minify({
			compressor: /js$/.test(fname) ? 'uglifyjs' : 'csso',

			input: "dev/" + fname,

			output: 'dist/' + fname.replace( /(\.\w+?$)/, ".min$1" ),

			callback: function (err, min) {
				if (err) {
					console.log("\t> MINIFY ERROR")
					console.log(err)
				}
			}
		});
	}

	for (let i=0; i < copyToExample.length; i++) 
	{
		const fname = copyToExample[i]

		console.log( "\tCopying "+fname )
		fs.copySync( "dev/"+fname, 'example/'+fname)
	}

}
catch(ex)
{
  	console.error("\t> EXCEPTION")
	console.error(ex)
}