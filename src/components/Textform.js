import React, { useState } from 'react'

export default function Textform(props) {
    const handleUpClick = () => {
        let newText = text.toUpperCase();
        setText(newText)
        props.showAlert("Converted to Uppercase!","success");
    }
    const handleLoClick = () => {
        let newText = text.toLowerCase();
        setText(newText)
        props.showAlert("Converted to Lowercase!","success");
    }
    const handleClearClick = () => {
        let newText = '';
        setText(newText)
        props.showAlert("Text Cleared!","success");
    }
    const handleReverse = (event) => {
        let strArr = text.split("");
        strArr = strArr.reverse();
        let newText = strArr.join("");
        setText(newText);
        props.showAlert("Text Reversed!","success");
    }
    const handleOnChange = (event) => {
        setText(event.target.value)
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        props.showAlert("Copied to Clipboard!","success");
    }
    const handleExtraSpaces = () => {
        let newText = text.split(/[ ]+/);
        setText(newText.join(" "))
        props.showAlert("Extra Spaces Removed!","success");
    }
    const [text, setText] = useState('');
    return (
        <>
            <div className="container" style={{ color: props.mode === 'dark' ? 'white' : '#042743' }}>
                <h1>{props.heading}</h1>
                <div className="mb-3">
                    <textarea className="form-control" value={text} onChange={handleOnChange} style={{ backgroundColor: props.mode === 'dark' ? '#042743' : 'white', color: props.mode === 'dark' ? 'white' : '#042743' }} id="myBox" rows="8"></textarea>
                </div>
                <button className="btn btn-primary mx-1 my-1" style={{ backgroundColor: props.mode === 'dark' ? 'white' :'#042743' , color: props.mode === 'dark' ? '#042743' : 'white'}} onClick={handleUpClick}>Convert to Uppercase</button>
                <button className="btn btn-primary mx-1 my-1" style={{ backgroundColor: props.mode === 'dark' ? 'white' :'#042743' , color: props.mode === 'dark' ? '#042743' : 'white'}} onClick={handleLoClick}>Convert to Lowercase</button>
                <button className="btn btn-primary mx-1 my-1" style={{ backgroundColor: props.mode === 'dark' ? 'white' :'#042743' , color: props.mode === 'dark' ? '#042743' : 'white'}} onClick={handleClearClick}>Clear Text</button>
                <button className="btn btn-primary mx-1 my-1" style={{ backgroundColor: props.mode === 'dark' ? 'white' :'#042743' , color: props.mode === 'dark' ? '#042743' : 'white'}} onClick={handleReverse}>Reverse</button>
                <button className="btn btn-primary mx-1 my-1" style={{ backgroundColor: props.mode === 'dark' ? 'white' :'#042743' , color: props.mode === 'dark' ? '#042743' : 'white'}} onClick={handleCopy}>Copy</button>
                <button className="btn btn-primary mx-1" style={{ backgroundColor: props.mode === 'dark' ? 'white' :'#042743' , color: props.mode === 'dark' ? '#042743' : 'white'}} onClick={handleExtraSpaces}>Remove Spaces</button>
            </div>
            <div className="container my-3" style={{ color: props.mode === 'dark' ? 'white' : '#042743' }}>
                <h2>Your text summary</h2>
                <p>{text.split(/\s+/).filter((element)=>{return element.length!==0}).length} words and {text.length} characters</p>
                <p>{0.008 * text.split(" ").filter((element)=>{return element.length!==0}).length} Minutes read</p>
                <h2>Preview</h2>
                <p>{text.length > 0 ? text : "Nothing to Preview"}</p>
            </div>
        </>
    )
}
