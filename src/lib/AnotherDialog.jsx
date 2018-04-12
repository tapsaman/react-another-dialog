import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AnotherDialogInput from "./AnotherDialogInput"

export { AnotherDialogInput }

//require('moment/locale/fi');

//module.exports.AnotherDialog = AnotherDialog

export const CLASS_ID = "a-dialog"

/*^^^^
## class AnotherDialog

React-component for building your dialog element in.

### Properties

| Name | Type | Default | Description
| -----|------|---------|------------
| title | string | n/a | Shown title (optional).
| subtitle | string | n/a | Shown subtitle. Included HTML will be rendered (optional).
| query | Array | n/a | Array of properties to render AnotherDialogInput-objects with OR ready-made input components (extending AnotherDialogInput)
| verification | bool/string | false | If true, verificate response before onSuccess. Give a string to define the verification question (default: "Are you sure to proceed?").
| animateIn | function | n/a | Function to animate in the dialog the way you wish.<br>Run as ```animateIn(formElement, maskElement)```
| animateOut | function | n/a | Function to animate out the dialog the way you wish.<br>Run as ```animateOut(formElement, maskElement, after)```<br>**Note**: Run the 'after'-function when done!
| onSuccess
| onCancel
| onFinish
| postValidate
| options | array | [{ type:"submit", value:"OK" },<br>{ type:"cancel", value:"Cancel" }] | Customize the main buttons. Additionals can be included:<br>{type: "button", value: "Example", onClick: function() {...}}

^^^^*/

export default class AnotherDialog extends React.Component {

	static showing = false

	static queryParams = [
		"title", 		// question header
		"name", 	 		// name/index number of output value
		"type", 		// hidden (default)/num/text/password/check/checkGroup/radio/select/date/addable
		"kind",			// alias of type
		"max",			// max value for "num", length for "text"/"password" or child amount for "addable"
		"min", 	 		// min value for "num", length for "text"/"password" or child amount for "addable"
		"range", 		// range string (e.g. "0-5") for "num"/"text"/"password"/"addable"
		"test", 		// regex to test "text"/"password" value with
		"testReq",		// explonation of test requirements
		"init",			// initial value
		"opt",			// option values for "radio"/"select"/"checkGroup" 
						// (use null for disabled options / option headers)
		"optTitles", 	// option titles for "radio"/"select"/"checkGroup",
		"children"		// array of inputs for "addable"
	]

	constructor(props)
	{
		super(props);
		this.state = {
			errorMessages: 	{},
			verificating: 	false,
			mainMessage: 	"",
			...this.propsToState(props)
		};

		this.output = {}
		this.formElems = {}
	}

	componentWillReceiveProps(nextProps)
	{
		this.setState( this.propsToState(nextProps) )
	}

	propsToState(props) {
		return {
			verifMsg: 	(typeof props.verification==="string"
						? props.verification
						: "Are you sure to proceed?"),
			options: props.options || 
				[{ 
					type:"submit",
					value:"OK" },
				{ 
					type:"cancel", 
					value:"Cancel" 
				}]
		}
	}

	/*componentDidCatch(error, info)
	{
		console.error("AnotherDialog Error")
		console.error(error, info)
	}*/

	componentDidMount() {
		const {
			animateIn
		}
		= this.props

		if (animateIn)
			animateIn(this.form, this.mask)

		setTimeout(this.focusOnFirstInput, 50)
	}

	render() {
		const { 
			verificating,
			verifMsg,
			options 
		} 
		= this.state
		const {
			title,
			subtitle,
			query,
			className,
			maskClassName,
			style
		}
		 = this.props

		return (
			<div 
				className={maskClassName || CLASS_ID+"-mask"}
				ref={mask => this.mask=mask}
				tabIndex="0"
				onKeyUp={this.onKey}
				>
				<form
					//className={CLASS_ID+"form "+(className || "")}
					className={className || CLASS_ID+"-form"}
					style={style}
					ref={form => this.form=form}
					action="javascript:;"
					onSubmit={verificating ? this.success : this.validate}
					>
					{title 
					&& 	<h1>{title}</h1>
					}
					{subtitle 
					&& 	<p className={CLASS_ID+"-subtitle"}
							dangerouslySetInnerHTML={{__html: this.props.subtitle}}/>
					}
					{query
					&&	<div className={CLASS_ID+"-query"}>
							{query.map((q, i) => 
								//<PromptInput
								//	{...q}
								//	disabled={verificating}
								//	name={q.name || "promptInput"+i}
								//	key={i}
								//	index={i}
								//	onChange={this.setInputValue}
								//	/>

								AnotherDialogInput.getInput({
									...q,
									name: q.name || "input"+i,
									disabled: verificating,
									key: i,
									onChange: this.setInputValue,
									ref: (el) => this.formElems[q.name || "input"+i] = el
								})
							)}
						</div>
					}
					<p className={CLASS_ID+"-main-message"}>
						{verificating 
						? 	verifMsg
						: 	this.state.mainMessage || ""
						}
					</p>
					<div className={CLASS_ID+"-option-buttons"}>
						{options.map((opt, i) =>
							<input type={opt.type==="submit"?opt.type:"button"} value={opt.value}
								onClick={opt.onClick || 
									opt.type==="cancel" 
									? (verificating ? this.cancelVerification : this.cancel)
									: undefined
								}
								key={i}
								/>
						)}
					</div>
				</form>
			</div>
		);
	}

	setInputValue = (value, name, index) => {
		this.output[name] = value
	}
 
	validate = () =>
	{
		const {
			query,
			postValidate,
			verification 
		}
		= this.props

		var allOK = true,
			newState = { mainMessage: "" }

		console.log("Dialog response: ", this.output);

		if (query)
			for (let i=0; i < query.length; i++)
			{
				const q = query[i]
				const result = this.formElems[q.name || "input"+i].validate()

				if (!result) {
					allOK = false
				}
			}

		if (allOK && postValidate) {
			let pv = postValidate(this.output)
			allOK = pv.pass
			newState.mainMessage = pv.message || ""
		}

		if (allOK) {
			if (verification)
			{
				newState.verificating = true
			}
			else {
				this.success()
			}
		}

		this.setState(newState)
	}

	__validate = () =>
	{
		const { query } = this.props

		var allOK = true,
			errorMessages = [],
			mainMessage = ""

		console.log("refs: ", this.refs)

		query.forEach((e,i) => {
			const input = this.refs[ e.out ]
			console.log(i + ": " + e.out)
			console.log(input)
			console.log(input.getValue())
		})
		
		this.formElems.forEach((e,i)=>{
			var q = this.props.query[i],
				val,
				errMsg = "",
				type = q.type || q.kind

			if (type === "num")
			{
				val = this.addValues[i];

				if (q.max && val > q.max) {
					errMsg = "Range for value is "+Number(q.min)+"-"+q.max;
					allOK = false;
				}
				else if (q.min && val < q.min) {
					errMsg = "Range for value is "+q.min+"-"+q.max;
					allOK = false;
				}
			}
			else if (type === "hidden")
			{
				val = e.value;
			}
			else if (type === "text" || type === "password")
			{
				val = e.value;
				
				if (this.props.test && !this.props.test.test(val))
				{
					errMsg = this.props.testReq || "Invalid value";
					allOK = false;
				}
				else if ((q.min && val.length < q.min) || (q.max && val.length > q.max))
				{
					if (q.max)
						errMsg = "Length must be between "+Number(q.min)+"-"+q.max;
					else
						errMsg = "Length must be at least "+Number(q.min);

					allOK = false;
				}
			}
			else if (type === "date")
			{
				val = this.addValues[i];

				if (typeof val === "object" && "valueOf" in val) {
					val = val.valueOf();
				}
				else if (isNaN(val)) {
					errMsg = "Not a valid date";
					allOK = false;
				}
			}
			else if (type === "check")
			{
				val = e.checked;
			}
			else if (type === "checkGroup")
			{
				val = [];

				for (var elei=0; elei < e.length; elei++)
				{
					if (e[elei] && e[elei].checked) {
						val.push( e[elei].value );
					}
				}

				if (val.length < q.min && !q.max) {
					errMsg = "Must select at least "+q.min;
					allOK = false;
				}
				else if (val.length > q.max && !q.min) {
					errMsg = "Can't select more than "+q.max;
					allOK = false;
				}
				else if (val.length < q.min || val.length > q.max) {
					errMsg = "Must select "+q.min+"-"+q.max+" options";
					allOK = false;
				}
			}
			else if (type === "radio")
			{
				val = null;

				for (var elei=0; elei < e.length; elei++)
				{
					if (e[elei].checked) {
						val = e[elei].value;
						break;
					}
				}

				if (val === null) {
					errMsg = "No option selected";
					allOK = false;
				}
			}
			else if (type === "select")
			{
				val = e.value
				if (!val && val !== 0)
				{
					errMsg = "No option selected";
					allOK = false;
				}
			}

			errorMessages[i] = errMsg;
			this.output[q.out] = val;
		});

		if (allOK && this.props.postValidate) {
			let pv = this.props.postValidate(this.output)
			allOK = pv.pass
			mainMessage = pv.msg
		}

		this.setState({
			errorMessages,
			mainMessage
		})

		if (allOK) {
			if (this.props.verification)
			{
				this.setState({
					verificating: true
				})
			}
			else {
				this.success()
			}
		}
	}

	success = () => {
		if (this.props.animateOut)
			this.props.animateOut(this.form, this.mask, this.closeSuccess)
		else
			this.closeSuccess()
		
	}

	closeSuccess = () => {
		if (this.props.onSuccess)
			this.props.onSuccess(this.output)
		if (this.props.onFinish)
			this.props.onFinish()
	}

	cancel = () => {
		if (this.props.animateOut)
			this.props.animateOut(this.form, this.mask, this.closeCancel)
		else
			this.closeCancel()
	}

	closeCancel = () => {
		if (this.props.onCancel)
			this.props.onCancel()
		if (this.props.onFinish)
			this.props.onFinish()
	}



	cancelVerification = () => {
		this.setState({
			verificating: false
		})
	}

	onKey = (e) => {
		var key = e.key || e.keyCode || w.which;

	    if (key === 'Escape' || key === 'Esc' || key === 27) {
	        if (this.state.verificating)
	        	this.cancelVerification()
	        else {
	        	this.cancel()
	        }
	   	}
	}

	focusOnFirstInput = () => {
		/*
		for (let i=0; i < this.formElems.length; i++)
		{
			let input = this.formElems[i]

			if (input && input.focus) {
				input.focus()
				return
			}
			else if (Array.isArray(input))
				for (let ii=0; ii < input.length; ii++)
				{
					if (input[ii] && input[ii].focus) {
						input[ii].focus()
						return
					}
				}
		}*/
	}
}