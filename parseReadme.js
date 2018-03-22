const fs = require('fs'); 
const glob = require('glob-fs')({ gitignore: true })
const package = require('./package.json')

const separator = "<br><br><br>*************************<br><br><br>"

var output = "",
	foundFiles = [], 
	extractCount = 0,
	readCount = 0,
	globEnd = false

function getHeader() {
	if (package) {
		return "# AnotherDialog document\n\n"
			+ package.description
			+ "\n\n+ **npm name:** " + package.name
			+ "\n+ **version:** " + package.version
			+ "\n+ **date:** " + getDateString()
			+ "\n+ **license:** " + package.license
			+ "\n+ **author:** " + package.author
			+ "\n<br><br>*** WORK IN PROGRESS ***<br><br>"
	}
	return "";
}

glob.readdirStream('src/*')
	.on('data', function (file) {
		console.log("Reading " + file.path)
		//console.log(Object.keys(file).map(o=>o+" => "+file[o]))
		//fs.readFile(file.path, 'utf8')
		const contents = fs.readFileSync(file.path, 'utf8')
		extract(file, contents)
		readCount++
	})
	.on('end', function() {
		globEnd = true
		writeOutput()
	})
	.on('error', function(ex) {
		console.error(ex)
		readCount++
	})


function extract(file, data) {

	const extractRegex = /\^\^\^\^([\s\S]+?)\^\^\^\^/g
	var res, iter = 0

	do {
		res = extractRegex.exec(data)

		if (res) {
			output += separator

			if (iter === 0)
				output += "*In file ["+file.basename+"]("+file.relative.replace(/\\/g,"//")+")*\n"

			output += res[1]
		}

		iter++;

	} while(res)

	extractCount++
	writeOutput()
}

function writeOutput() {

	if (globEnd && extractCount === readCount)
	{
		console.log("End of search.")

		if (output.length === 0)
		{
			console.log("Found nothing to extract...")
			return
		}

		output = getHeader() + output

		fs.writeFile('README.md', output, function(err) {
		    if (err) throw err;
		    console.log("Generated .md")
		})
	}
}

function getDateString()
{
	const d = new Date()
	var str = d.getFullYear() 
			+ "/" + d.getMonth()
			+ "/" + d.getDate()

	// Padd lone numbers with zeroes, "2018/3/1 -> 2018/03/01"
	str = str.replace( /\/(\d(?!\d))/g, "/0$1" )

	return str
}