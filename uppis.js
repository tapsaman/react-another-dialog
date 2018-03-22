const { execSync } = require('child_process');

console.log(process.argv)

const commitMsg = process.argv[2] 
	? process.argv[2].slice(2)
	: "nameless-commit"

const commands = [
	"git add .",
	"git commit -m '"+commitMsg+"'",
	"npm version patch",
	"node parseReadme.js",
	"git add .",
	"git commit --amend --no-edit",
	"git push",
	"npm publish"
]

try {

	for (let i=0; i < commands.length; i++) {
		console.log( "\t> " + commands[i] )
		let stdout = execSync( commands[i] )
		console.log( stdout )
	}

}
catch(ex) {

	console.error("\t> EXCEPTION")
	console.error(ex)

}