const { execSync } = require('child_process');

const commitMsg = process.argv[2] || "nameless-commit" + new Date().toTimeString().slice(0,8)

console.log("Commiting as '"+commitMsg+"'")

const commands = [
	"git add .",
	"git commit -m '"+commitMsg+"'",
	"npm version patch",
	"node doc-parser.js",
	"git add .",
	"git commit --amend --no-edit",
	"git push",
	"npm publish"
]

try {

	console.log("git add .")
	execSync("git add .", {stdio:'inherit'})
	
	//console.log( execSync("git add .").toString() )
	
	//console.log("git add .")
	//stdout = execSync("git add .")

	//console.log( "\t> " + commands[0] )
	//console.log( stdout )

}
catch(ex) {

	console.error("\t> EXCEPTION")
	console.error(ex)

}