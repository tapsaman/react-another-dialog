const fs = require('fs'); 
const glob = require('glob-fs')({ gitignore: true })
const package = require('./package.json')

module.exports = parse

const regexOperators = /[|\\{}()[\]^$+*?.]/g;
const separator = "<br><br>\n*************************\n<br><br><br>"


function parse(options) {
	const {
		srcFiles,
		title,
		outPath = "doc-parsed.md",
		cutStart = "^^^^",
		cutEnd = "^^^^"
	}
	= options

	let output = ""
	const exctractRegex = new RegExp(
		cutStart.replace(regexOperators, '\\$&'),
		+ "([\\s\\S]+?)"
		+ cutEnd.replace(regexOperators, '\\$&'),
	)

	if (!srcFiles)
		throw new Error("Parameter error: no [srcFiles] in options")


	for (let i=0; i < srcFiles.length; i++)
	{
		const filePath = srcFiles[i]
		console.log("Reading "+filePath)
		const contents = fs.readFileSync(filePath, 'utf8')
		output += extract(filePath, contents, exctractRegex)
	}

	// Write output

	console.log("End of search.")

	if (output.length === 0)
	{
		console.log("Found nothing to extract...")
		return
	}

	output = (title ? title+"\n\n" : "")
		+ getHeader()
		+ output

	fs.writeFile(outPath, output, function(err) {
	    if (err) throw err;
	    console.log("Generated file "+outPath)
	})
}

function extract(filePath, data, exctractRegex) {

	let output, res, iter = 0

	do {
		res = extractRegex.exec(data)

		if (res) {
			output += separator

			if (iter === 0)
				output += getFileHeader(filePath)

			output += res[1]
		}

		iter++;

	} while(res)

	return output
}

const _srcFilePaths = [
	"src/AnotherDialog.jsx",
	"src/AnotherDialogInput.jsx"
]


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
			+ 	"\n+ **version:** " + package.version
			+ 	"\n+ **date:** " + getDateString()
			+ 	"\n+ **license:** " + package.license
			+ 	"\n+ **author:** " + package.author
			+ 	"\n\n<br><br>\n*** WORK IN PROGRESS ***\n<br>"
	}
	return "";
}

function getFileHeader(filePath) {
	return "*In file ["
		// base name
		+ filePath.replace( /^.+[\/\\]/, "" )
		+ "]("
		// relative path
		+ file.relative.replace(/\\/g,"//")+")*\n"
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



function getDateString()
{
	const d = new Date()
	var str = d.getFullYear() 
			+ "/" + d.getMonth()
			+ "/" + d.getDate()

	// Padd lone numbers with zeroes "2018/3/1 -> 2018/03/01"
	str = str.replace( /\/(\d(?!\d))/g, "/0$1" )
	// Add time
	str += " " + d.toTimeString().slice(0,8)

	return str
}