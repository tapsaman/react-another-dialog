const { execSync } = require('child_process');
const docParser = require('./doc-parser');
const package = require('./package.json')

const commitMsg = "nameless-commit" + new Date().toTimeString().slice(0,8)
const newversion = process.argv[2] || "patch"

console.log("Push npm version "+newversion)

function runCmd(command)
{
	console.log( "\t> " + command )
	execSync(command, {stdio:'inherit'})
}

try {

	runCmd("git add .")
	runCmd("git commit -m '"+commitMsg+"'")
	runCmd("npm version "+newversion)

	docParser({
		title: "react-another-dialog documentation\n"
			+"Build upon (https://github.com/yogaboll/react-npm-component-starter)",
		srcFiles: [
			"lib/AnotherDialog.js",
			"lib/AnotherDialogInput.js"
		],
		outPath: "README.md",
		npmPackage: package
	})

	commitMsg = package.version || commitMsg

	runCmd("git add .")
	runCmd("git commit --amend -m '"+commitMsg+"'")
	runCmd("git push")
	runCmd("npm publish")
	
}
catch(ex) {

	console.error("\t> EXCEPTION")
	console.error(ex)

}