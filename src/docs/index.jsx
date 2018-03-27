import React from "react";
import { render } from "react-dom";
import Velocity from "velocity-animate";

import AnotherDialog, { AnotherDialogInput } from "../../lib/AnotherDialog.js";

class Demo extends React.Component {

	constructor(props)
	{
		super(props)
		this.state = {
			showExampleDialog: false
		}
	}

	componentDidCatch(error, info)
	{
		console.error("AnotherDialogExampleApp Error")
		console.error(error, info)
	}

	render()
	{
		const { 
			showExampleDialog, 
			exampleDialogProps,
			exampleDialogResponse,
			exampleDialogResponseStr
		} 
		= this.state

		const inputTypeNames = AnotherDialogInput.types.map(t => t.name)
 
		return (
			<div>
				<AnotherDialog
					title="Build dialog"
					maskClassName="no-mask"
					className="no-mask"
					query={[
					{
						name: "title",
						placeholder: "Dialog title",
						type: "text", 
					},
					{
						name: "subtitle",
						title: "Dialog subtitle",
						type: "text", 
						className: "inline"
					},
					{
						name: "query",
						title: "Dialog inputs",
						type: "addable",
						min: 0,
						init: 1,
						children: [
						{
							title: "title",
							name: "title",
							type: "text"
						},
						{
							title: "name",
							name: "name",
							type: "text"
						},
						{
							title: "type",
							name: "type",
							type: "select",
							opt: inputTypeNames,
							optTitles: inputTypeNames
						},
						{
							title: "className",
							name: "className",
							type: "text"
						},
						{
							title: "init",
							name: "init",
							type: "text"
						},
						{
							title: "min",
							name: "min",
							type: "num",
							init: 0
						},
						{
							title: "max",
							name: "max",
							type: "num",
							init: 10
						},
						]
					}]
					}
					onSuccess={this.showExampleDialog}
					options={[{type: "submit", value: "Example dialog"}]}
					/>
				{showExampleDialog
				&&	<AnotherDialog
						{...exampleDialogProps}
						onSuccess={this.saveExampleDialogResponse}
						onFinish={this.hideExampleDialog}
						animateIn={this.exampleDialogAnimateIn}
						animateOut={this.exampleDialogAnimateOut}
						/>
				}
				{exampleDialogResponse
				&&	<div>
						<h2>Given response</h2>
						<div className="example-response"
							dangerouslySetInnerHTML={{__html:
								exampleDialogResponseStr
							}}
							/>
					</div>
				}
			</div>
		)
	}

	showExampleDialog = (response) => {
		//console.log("### RESP ###",response)

		this.setState({
			exampleDialogProps: response,
			showExampleDialog: true
		})
	}

	hideExampleDialog = () => {
		this.setState({
			showExampleDialog: false
		})
	}

	saveExampleDialogResponse = (response) => {
		let responseStr = JSON.stringify(response, null, "<br>")
		responseStr = responseStr.slice(0, responseStr.length-1)
			.replace(/<br>/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;")
			+ "<br>}"

		this.setState({
			exampleDialogResponse: response,
			exampleDialogResponseStr: responseStr
		})
	}

	exampleDialogAnimateIn(form, mask, doAfter) {
		console.log("#", form)
		console.log("#", mask)
		//Velocity(form, "fadeIn", doAfter)

		Velocity(form, {
			scale: [1, 0]
		}, {
			easing: [500, 20]
		})

	}

	exampleDialogAnimateOut(form, mask, doAfter) {
		Velocity(form, "fadeOut", doAfter)
	}

}

render(<Demo />, document.getElementById("app"));