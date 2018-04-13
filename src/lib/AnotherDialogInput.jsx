import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import Datetime from 'react-datetime';
import moment from 'moment';
//import 'react-datetime/css/react-datetime.css';

const CLASS_ID = "a-dialog"

/*^^^^
## class AnotherDialogInput

Base class for AnotherDialog-input React-components.

### Properties

Name | Type | Default | Description
-----|------|---------|------------
title | string | n/a | Question header (optional).
name | string | n/a | Name of output value
type | string | "hidden" | "text"/"password"/"check"/"number"/"radio"/"select"/"group"/"addable"/"hidden"
kind | string | "hidden" | alias of type
init | string/number | n/a | initial value or child amount for "addable"
max | number | n/a | max value for "num", length for "text"/"password" or child amount for "addable"
min | number | n/a | min value for "num", length for "text"/"password" or child amount for "addable"
range | string	| n/a | range string, overrides min/max (e.g. "0-5")
test | function | n/a | test "text"/"password" value with
opt | array | n/a | option values for "radio"/"select" (use null for disabled options / option headers)
optTitles | array | n/a | option titles for "radio"/"select"
children | array | n/a | inputs for "addable"/"group"


^^^^*/

export default class AnotherDialogInput extends React.Component {

	static types = [];

	static __setTypes() 
	{
		AnotherDialogInput.types = [
		{
			name: "text",
			regx: /^te?xt$/,
			comp: TextADInput
		},
		{
			name: "password",
			regx: /^pass(w|word)?$/,
			comp: PasswordADInput
		},
		{
			name: "check",
			regx: /^check(box)?$/,
			comp: CheckADInput
		},
		{
			name: "number",
			regx: /^num(ber)?$/,
			comp: NumberADInput
		},
		{
			name: "radio",
			regx: /^rad(io)?$/,
			comp: RadioADInput
		},
		{
			name: "select",
			regx: /^sel(ect)?$/,
			comp: SelectADInput
		},
		{
			name: "date",
			regx: /^date$/,
			comp: DateADInput
		},
		{
			name: "group",
			regx: /^gr(ou)?p$/,
			comp: GroupADInput
		},
		{
			name: "addable",
			regx: /^add(able)?$/,
			comp: AddableADInput
		},
		{
			name: "hidden",
			regx: /^(hidden)?$/,
			comp: HiddenADInput
		}]
	}

	static getTypeName(typeAbbrev) {
		const type = AnotherDialogInput.types.find(t => t.regx.test(typeAbbrev))
		return type ? type.name : undefined
	}

	static getType(typeAbbrev) {
		const type = AnotherDialogInput.types.find(t => t.regx.test(typeAbbrev))
		return type || undefined
	}

	static getInput(props) {
		var type = AnotherDialogInput.getType(props.type || props.kind)

		if (!type) {
			console.warn("AnotherDialogInput type " + (props.type || props.kind) + " not known, using 'hidden'")
			type = AnotherDialogInput.getType("hidden")
		}

		const InputComponent = type.comp

		return <InputComponent {...props}/>
	}

	constructor(props) {
		super(props)

		this.state = {}
		this.state = this.propsToState(props)
		props.onChange(this.state.value, props.name, props.index)
	}

	componentWillReceiveProps(nextProps)
	{
		//this.setState( this.propsToState(nextProps) )
	}

	componentDidCatch(error, info)
	{
		console.error("AnotherDialogInput Type:"+this.type+" Error")
		console.error(error, info)
	}

	propsToState(props) {
		let max, 
			min,
			value

		if (props.range)
		{
			var nums = range.match( /^(-?\d+).*?(\d+)$/ )
			min = Number( nums[0] )
			max = Number( nums[1] )
		}

		if (this.state.value || this.state.value===0) 
			value = this.state.value
		else if (props.init || props.init===0)
			value = props.init
		else
			value = ""

		return {
			min: this.state.min || min || props.min, 
			max: this.state.max || max || props.max,
			value: value
		}
	}

	// works for text, password and select inputs
	setInputValue = (inputValue, name, index) =>
	{
		const {
			min,
			max
		}
		= this.state

		var value = inputValue.target.value;
		
		if (max === undefined || value.length < max) {
			this.setState({
				value: value
			})

			this.props.onChange(value, this.props.name, this.props.index)
		}
	}

	// works for select only .. for now
	static optBuilder(props, state)
	{
		var value = state.value || props.init
		const newOpt = []
		const newOptMax = Math.max(
			props.opt ? props.opt.length : 0,
			props.optTitles ? props.optTitles.length : 0)
		
		let searchForInit = !state.value
		
		for (let i=0; i < newOptMax; i++)
		{
			let oldOption
			let newOption

			if (props.opt && (props.opt[i] || props.opt[i]===0))
				oldOption = props.opt[i]
			else 
				oldOption = null

			if (oldOption && typeof oldOption === "object") {
				newOption = oldOption
			}
			else {
				const oldTitle = (props.optTitles && props.optTitles[i]) || null

				newOption = {
					value: oldOption,
					title: oldTitle || (oldOption===null ? "---":oldOption)
				}
			}

			if (searchForInit && newOption.value===value)
				searchForInit = false

			newOpt.push( newOption )
		}

		// If props.init not found in props.opt, set initial value to first  not null

		if (searchForInit) {
			for (let i=0; i < newOptMax; i++)
				if (newOpt[i].value || newOpt[i].value === 0) {
					value = newOpt[i].value
					break;
				}
		}

		return {
			opt: newOpt,
			value: value
		}
	}

	// works for text and password inputs
	validate() {
		const {
			value,
			min,
			max
		}
		= this.state
		const {
			test
		}
		= this.props

		let errMsg = null

		if ((min && value.length < min) || (max && value.length > max))
		{
			if (min && max)
				errMsg = min+"-"+max+" characters.";
			else if (min)
				errMsg = "Min. "+min+" characters.";
			else
				errMsg = "Max. "+max+" characters.";
		}
		else if (test) {
			const ret = test(value)

			if (!ret.pass) {
				errMsg = ret.message || "Invalid value"
			}
		}

		this.setState({
			errorMessage: errMsg
		})

		return (errMsg === null)
	}

	render() {
		const {
			min,
			max,
			value,
			errorMessage
		}
		 = this.state
		const {
			title, 	
			name, 		
			test, 	
			testReq,
			disabled,
			className,
			placeholder
		}
		 = this.props

		return (
			<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				{	
					<input name={name}
						type={this.type}
						maxLength={max}
						disabled={disabled}
						placeholder={placeholder}
						onChange={this.setInputValue}
						value={value}
						/>
				}
				{errorMessage && <p className={CLASS_ID+"-error-message"}>{errorMessage}</p>}
			</div>
		)
	}

	__render() {
		const {
			type,
			min,
			max,
			childAmount,
			value
		}
		 = this.state
		const {
			title, 	
			name, 		
			test, 	
			testReq,
			init,
			opt,			
			optTitles,
			children,
			disabled,
			className,
			placeholder
		}
		 = this.props

		if (type === "addable")
		{
			var addableArr = []
			for (let i = 0; i < childAmount; i++)
				addableArr[i] = i;
		}

		console.log("render "+name+" value:"+value)

		return (
			<div className={"adialog-i adialog-i-"+type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				{	
					type === "hidden"
				?	<input type="hidden"
						name={name}
						value={value}
						/>

				: 	type === "addable"
				?	<div>
						<div className="addable-add-rem">
							<span className="add-rem" onClick={this.removeChild}>-</span>
							<span>{childAmount}</span>
							<span className="add-rem" onClick={this.addChild}>+</span>
						</div>
						{addableArr.map(add_i => 
							<div className="addable-child" key={add_i}>
								{children.map((q, i) => 
									AnotherDialogInput.getInput({
										...q,
										name: q.name || name+"_addable"+add_i+"_input"+i,
										className: q.className || "inline",
										disabled: disabled,
										key: i,
										index: add_i,
										onChange: this.setInputValue
									})


									/*<AnotherDialogInput 
										{...q}
										disabled={disabled}
										//ref={add_i+"_"+ q.name}
										className={q.className || "inline"}
										name={q.name || name+"_addable"+add_i+"_input"+i}
										key={i}
										index={add_i}
										onChange={this.setInputValue}
										/>*/
								)}
							</div>
						)}
					</div>

				: 	type === "text" || type === "password"
				? 	<input name={name}
						//defaultValue={init || ""}
						type={type}
						maxLength={max}
						disabled={disabled}
						placeholder={placeholder}
						onChange={this.setInputValue}
						value={value}
						/>

				: 	type==="check"
				? 	<span>
						<input name={name}
							type="checkbox"
							checked={init}
							onChange={this.setInputValue}
							/>
						<span>{title}</span>
					</span>
				
				: 	type==="checkGroup"
				? 	<div className="check-group">
						{opt.map((opt,i) => 
							<div key={i}>
								{opt !== null
								&&	<input name={name}
										type="checkbox"
										value={opt}
										defaultChecked={init}
										ref={(elem) => { 
											if (!this.formElems[index])
												this.formElems[index]=[];
											this.formElems[index][i] = elem; 
										}}
										/>
								}
								<span className={opt===null ? "check-group-header" : undefined}>
									{optTitles[i] || "-"}
								</span>
							</div>
						)}
					</div>
				: 	type==="number"
				? 	<NumericInput name={name}
						max={max}
						min={min}
						value={value}
						onChange={this.setInputValue}
						strict
						/>
				: 	type==="date"
				?	<Datetime name={question.name}
						defaultValue={question.init || new Date()}
						strictParsing={true}
						onChange={moment => {
							if (typeof moment==="object")
								this.addValues[index] = moment;
							else 
								this.formElems[index].value = this.addValues[index];
						}}
						ref={elem => {
								let init;

								if (question.init) {
									if (!isNaN(question.init))
										init = question.init;
									else if (question.init.getTime)
										init = question.init.getTime();
									else
										init = new Date();
								}
								else {
									init = new Date();
								}

								this.formElems[index] = elem;
								this.addValues[index] = init;
							}}
							/>
				: 	type==="radio"
				?	opt.map((opt,i)=>
						<span key={i} className="radio-span">
							<input name={question.name}
								type="radio"
								defaultChecked={question.init ? question.init===opt : (i===0?true:false)}
								disabled={disabled}
								value={opt}
								onChange={this.setInputValue}
								/>
							<span>{question.optTitles[i]}</span>
						</span>)
				: 	null
				}
			</div>
		)
	}

	__setInputValue = (inputValue, name, index) => {
		const {
			type,
			min,
			max
		}
		 = this.state

		console.log(type+" set input value")
		console.log("inputValue", inputValue)
		console.log("name", name)
		console.log("index", index)

		var value = 
			  type === "text" || type === "select"
			? inputValue.target.value
			: type === "check"
			? inputValue.target.checked
			: inputValue

		///console.log(value)

		if (type==="addable") {
			value = this.state.value
			console.log("value:",value)
			value[index][name] = inputValue
		}

		console.log("setting val for "+this.props.name+":", value)

		this.setState({
			//value: (type==="number" ? 666 : value)
			value: value
		})

		this.props.onChange(value, this.props.name, this.props.index)


		return true;
	}

	addChild = () => {
		const {
			max,
			childAmount
		}
		 = this.state

		console.log(childAmount, max)

		if (max === undefined || childAmount < max)
			this.setState({
				childAmount: childAmount+1,
				value: this.state.value.concat({})
			})
	}

	removeChild = () => {
		const {
			min,
			childAmount
		}
		 = this.state

		if (childAmount > min)
			this.setState({
				childAmount: childAmount-1
			})
	}
}


class TextADInput extends AnotherDialogInput {

	type = "text"

}

class PasswordADInput extends AnotherDialogInput {

	type = "password"

}

class CheckADInput extends AnotherDialogInput {
	
	type = "check"

	propsToState(props) {
		return {
			value: this.state.value===undefined 
				? !!props.init
				: !!this.state.value
	 	}
	}

	setInputValue = (inputValue, name, index) =>
	{
		const value = inputValue.target.checked
		
		this.setState({
			value: value
		})

		this.props.onChange(value, this.props.name, this.props.index)
	}

	render() {
		const {
			value
		}
		 = this.state
		const {
			title, 	
			name,
			disabled,
			className
		}
		 = this.props

		return (
			<span className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && !/inline/.test(className) && <h2 className="input-title">{title}</h2>}
				<input name={name}
					type="checkbox"
					checked={value}
					onChange={this.setInputValue}
					/>
				{title && /inline/.test(className) && <h2 className="input-title">{title}</h2>}
			</span>
		)
	}
}

class NumberADInput extends AnotherDialogInput {
	
	type = "number"

	setInputValue = (inputValue, name, index) =>
	{
		const {
			min,
			max
		}
		= this.state
		
		if ((min === undefined || inputValue >= min)
		 && (max === undefined || inputValue <= max))
		{
			this.setState({
				value: inputValue
			})

			this.props.onChange(inputValue, this.props.name, this.props.index)
		}
	}

	render() {
		const {
			min,
			max,
			value,
			errorMessage
		}
		 = this.state
		const {
			title, 	
			name,
			disabled,
			className
		}
		 = this.props

		return (
			<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				<NumericInput 
						name={name}
						max={max}
						min={min}
						value={value}
						onChange={this.setInputValue}
						//strict
						/>
				{errorMessage && <p className={CLASS_ID+"-error-message"}>{errorMessage}</p>}
			</div>
		)
	}
}

class DateADInput extends AnotherDialogInput {
	
	type = "date"

	propsToState(props) {
		return {
			...super.propsToState(props),
			value: this.state.value!==undefined 
				? this.state.value
				: isNaN(props.init)
				? undefined
				: Number(props.init)
	 	}
	}

	setInputValue = (moment, name, index) =>
	{
		const {
			min,
			max
		}
		= this.state

		var value = moment.valueOf
			? moment.valueOf()
			: null

		console.log(moment, value)
		console.log("r:"+min+"-"+max)
		
		if (moment.valueOf && value >= min && value <= max) {

			console.log("setting"+ value)

			this.setState({
				value: value
			})

			this.props.onChange(value, this.props.name, this.props.index)
		}
	}

	validate() {
		const {
			value,
			min,
			max
		}
		= this.state
		const {
			test
		}
		= this.props

		let errMsg = null

		if ((min && value < min) || (max && value > max))
		{
			if (min && max)
				errMsg = "Choose between "
					+ moment(new Date(min)).format("YYYY-MM-DD HH:mm:ss")
					+ " and "
					+ moment(new Date(max)).format("YYYY-MM-DD HH:mm:ss")
			else if (min)
				errMsg = "Choose after "
					+ moment(new Date(min)).format("YYYY-MM-DD HH:mm:ss")
			else if (max)
				errMsg = "Choose before "
					+ moment(new Date(min)).format("YYYY-MM-DD HH:mm:ss")
		}
		else if (test) {
			const ret = test(value)

			if (!ret.pass) {
				errMsg = ret.message || "Invalid value"
			}
		}

		this.setState({
			errorMessage: errMsg
		})

		return (errMsg === null)
	}

	render() {
		const {
			min,
			max,
			value,
			errorMessage
		}
		 = this.state
		const {
			title, 	
			name,
			disabled,
			className
		}
		 = this.props

	 	const d = !isNaN(value) ? new Date(value) : new Date()

		console.log("&& "+value, d)

		return (
			<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				<Datetime name={name}
					//defaultValue={init || new Date()}
					//strictParsing={true}
					value={d}
					onChange={this.setInputValue}
					/>
				{errorMessage && <p className={CLASS_ID+"-error-message"}>{errorMessage}</p>}
			</div>
		)
	}
}

class RadioADInput extends AnotherDialogInput {

	type = "radio"

	propsToState(props)
	{
		var value = this.state.value || props.init
		const opt = []
		const optMax = Math.max(
			props.opt ? props.opt.length : 0,
			props.optTitles ? props.optTitles.length : 0)
		let searchForInit = false
		
		for (let i=0; i < optMax; i++)
		{
			if (props.opt && typeof props.opt[i] === "object") {
				opt.push(props.opt[i])
			}
			else {
				opt.push({
					value: (props.opt && props.opt[i] 
						? props.opt[i] 
						: null),
					title: (props.optTitles && props.optTitles[i] 
						? props.optTitles[i] 
						: props.opt[i])
				})
			}
			if (!searchForInit && opt[opt.length-1]===value)
				searchForInit = true
		}

		if (!searchForInit) {
			for (let i=0; i < optMax; i++)
				if (opt[i].value) {
					value = opt[i].value
					break;
				}
		}

		return {
			//...super.propsToState(props),
			opt: opt,
			value: value
		}
	}

	render()
	{
		const {
			value,
			opt,
			errorMessage
		}
		 = this.state
		const {
			title, 	
			name,
			disabled,
			className
		}
		 = this.props


		return (
			<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				{opt.map((o,i) =>
						<span key={i} className="radio-span">
							<input name={o.name}
								type="radio"
								//defaultChecked={o.init ? question.init===opt : (i===0?true:false)}
								disabled={disabled}
								value={o.value}
								checked={value==o.value}
								onChange={this.setInputValue}
								/>
							<span>{o.title}</span>
						</span>)
				}
				{errorMessage && <p className={CLASS_ID+"-error-message"}>{errorMessage}</p>}
			</div>
		)

	}

}

class SelectADInput extends AnotherDialogInput {

	type = "select"

	propsToState(props)
	{
		return {
			//...super.propsToState(props),
			...AnotherDialogInput.optBuilder(props, this.state),
		}
	}

	render() {
		const {
			value,
			opt,
			errorMessage
		}
		 = this.state
		const {
			title, 	
			name,
			disabled,
			className
		}
		 = this.props

		return (
			<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				<select
					value={value}
					onChange={this.setInputValue}
					disabled={disabled}
					>
					{opt.map((o,i) =>
						<option 
							key={i}
							disabled={!o.value && o.value !== 0}
							value={o.value}>
							{o.title}
						</option>
					)}
				</select>
				{errorMessage && <p className={CLASS_ID+"-error-message"}>{errorMessage}</p>}
			</div>
		)
	}
}

class GroupADInput extends AnotherDialogInput {
	
	type = "group"

	propsToState(props) {
		if (!this.formElems) this.formElems = {}
		return {
			value: this.state.value || {}
	 	}
	}

	setInputValue = (inputValue, name, index) =>
	{
		const value = this.state.value
		value[name || index] = inputValue

		this.setState({
			value: value
		})

		this.props.onChange(value, this.props.name, this.props.index)
	}

	render() {
		const {
			value
		}
		 = this.state
		const {
			title, 	
			name,
			disabled,
			className,
			children
		}
		 = this.props

		return (
			<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				{children.map((q, i) => 
					AnotherDialogInput.getInput({
						...q,
						name: q.name,
						className: q.className,
						disabled: disabled,
						key: i,
						index: i,
						onChange: this.setInputValue,
						ref: (el) => this.formElems[q.name || i] = el
					})
				)}
			</div>
		)
	}
}

class AddableADInput extends AnotherDialogInput {

	type = "addable"

	propsToState(props)
	{
		const value = this.state.value || []
		const childAmount = !isNaN(this.state.childAmount) 
			? this.state.childAmount
			: props.init || this.state.min || 0

		if (!this.formElems) this.formElems = []

		for (let i=0; i < childAmount; i++) {
			if (!value[i]) value[i] = {}
			if (!this.formElems[i]) this.formElems[i] = {}

		}

		return {
			...super.propsToState(props),
			childAmount: childAmount,
			value: value
		}
	}

	setInputValue = (inputValue, name, index) =>
	{
		const {
			value,
			childAmount
		}
		 = this.state

		if (!value[index]) 
			value[index] = {}

		value[index][name] = inputValue		

		this.setState({
			value: value
		})

		this.props.onChange(value.slice(0,childAmount), 
			this.props.name, this.props.index)
	}

	validate() {
		const {
			childAmount
		}
		 = this.state
		const {
			children
		}
		 = this.props

		var allOK = true

		console.log("addable formElems", this.formElems)
		console.log("addable formElems", this.formElems)

		for (var i=0; i < childAmount; i++)
		{
			for (var c=0; c < children.length; c++)
			{
				console.log(i)

				const result = this.formElems[i][children[c].name || "input"+i]
					.validate()

				if (!result) {
					allOK = false
				}
			}
		}

		return allOK
	}

	render() {
		const {
			min,
			max,
			childAmount
		}
		 = this.state
		const {
			title, 	
			name,
			children,
			disabled,
			className
		}
		 = this.props

		// Dummy number array to map through
		var addableArr = []
		for (let i = 0; i < childAmount; i++) {
			addableArr[i] = i;
			if (!this.formElems[i]) this.formElems[i] = {}
		}

		return (
			<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
				{title && <h2 className="input-title">{title}</h2>}
				<div className="addable-add-rem-container">
					<span className="addable-add-rem addable-rem" onClick={this.removeChild}>-</span>
					<span>{childAmount}</span>
					<span className="addable-add-rem addable-add" onClick={this.addChild}>+</span>
				</div>
				{addableArr.map(add_i => 
					<div className="addable-child" key={add_i}>
						{children.map((q, i) => 
							AnotherDialogInput.getInput({
								...q,
								//name: q.name || "input"+i,
								className: q.className || "inline",
								disabled: disabled,
								key: i,
								index: add_i,
								onChange: this.setInputValue,
								ref: (el) => this.formElems[add_i][(q.name || "input"+i)] = el
							})
						)}
					</div>
				)}
			</div>
		)
	}

	addChild = () => {
		const {
			max,
			childAmount,
			value
		}
		 = this.state

		if (max === undefined || childAmount < max)
		{
			while (value.length < childAmount)
				value.push({})
			while (this.formElems.length < childAmount)
				this.formElems.push({})

			this.setState({
				childAmount: childAmount+1,
				value: value
			})
		}
	}

	removeChild = () => {
		const {
			min,
			childAmount
		}
		 = this.state

		if (childAmount > min)
			this.setState({
				childAmount: childAmount-1
			})

		this.props.onChange(this.state.value.slice(0,childAmount-1), 
			this.props.name, this.props.index)
	}
}

class HiddenADInput extends AnotherDialogInput {

	type = "hidden"

	setInputValue = (inputValue, name, index) =>
	{
		var value = this.props.init
		
		this.setState({
			value: value
		})

		this.props.onChange(value, this.props.name, this.props.index)
	}

	render() {
		const {
			title, 	
			className
		}
		 = this.props

		return (title 
			?	<div className={CLASS_ID+"-input "+CLASS_ID+"-input-"+this.type+" "+(className || "")}>
					{title && <h2 className="input-title">{title}</h2>}
				</div>
			: 	null
		)
	}
}

AnotherDialogInput.__setTypes()
/*
module.exports.default = AnotherDialogInput
module.exports.TextADInput = TextADInput
module.exports.PasswordADInput = PasswordADInput
module.exports.CheckADInput = CheckADInput
module.exports.NumberADInput = NumberADInput
module.exports.DateADInput = DateADInput
module.exports.SelectADInput = SelectADInput
module.exports.GroupADInput = GroupADInput
module.exports.AddableADInput = AddableADInput
module.exports.HiddenADInput = HiddenADInput*/