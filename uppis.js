const { execSync } = require('child_process');
const docParser = require('./doc-parser');
const package = require('./package.json')

const newversion = process.argv[2] || "patch"
var commitMsg = process.argv[3] || "nameless-commit" + new Date().toTimeString().slice(0,8)

console.log("Push npm version " + newversion)

function runCmd(command)
{
	console.log( "\t> " + command )
	execSync(command, {stdio:'inherit'})
}

try {

	//runCmd("git add .")
	//runCmd("git commit -m \""+commitMsg+"\"")
	//runCmd("npm version "+newversion)

	docParser.parse({
		title: "react-another-dialog documentation\n"
			+"Build upon (https://github.com/yogaboll/react-npm-component-starter)",
		srcFiles: [
			"src/lib/AnotherDialog.jsx",
			"src/lib/AnotherDialogInput.jsx"
		],
		outPath: "README.md",
		npmPackage: package
	})

	commitMsg = package.version || commitMsg

	runCmd("npm publish")
	runCmd("git add .")
	runCmd("git commit --amend -m \""+commitMsg+"\"")
	runCmd("git push")	
}
catch(ex) {

	console.error("\t> EXCEPTION")
	console.error(ex)

}