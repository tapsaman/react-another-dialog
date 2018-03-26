/*
// node-resolve will resolve all the node dependencies
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/AnotherDialog.jsx',
  output: {
    file: 'rollup/bundle.js',
    format: 'cjs'
  },
  // All the used libs needs to be here
  external: [
    'react'
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

/*src\AnotherDialog.jsx
Error: It looks like your Babel configuration specifies a module transformer. Pl
ease disable it. See https://github.com/rollup/rollup-plugin-babel#configuring-b
abel for more information*/

const babel = require("rollup-plugin-babel");
//const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");

export default {
	input: "src/AnotherDialog.jsx",
	output: {
		file: "rollup2/main.js",
		format: "cjs",
	},
	plugins: [
		resolve(),
		//commonjs(),
		babel()
	]
}

/*[!] (babel plugin) ReferenceError: [BABEL] C:\git\react-another-dialog\src\x.js:
 Using removed Babel 5 option: foreign.modules - Use the corresponding module tr
ansform plugin in the `plugins` option. Check out http://babeljs.io/docs/plugins
/#modules*/