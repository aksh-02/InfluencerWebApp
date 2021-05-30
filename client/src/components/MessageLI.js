import React, {useState} from 'react'
import MessageBox from './MessageBox'
import './MessageLI.css'
import {useSelector} from 'react-redux'

function MessageLI(props) {
    const username = useSelector(state => state.username)
	const [messageBox, setMessageBox] = useState(false)

	function compareTimestamps(a, b) {
		if (Date.parse(a.timestamp) < Date.parse(b.timestamp)){
		  return -1;
		} else if (Date.parse(a.timestamp) > Date.parse(b.timestamp)){
		  return 1;
		}
		return 0;
	}
	console.log("In MessageLI", props["data"])
	let messagesOrdered = props["data"].sort(compareTimestamps)
	console.log("In MessageLI", messagesOrdered)
	return (
		<>
		<div className="messageLI" onClick={() => setMessageBox(!messageBox)}>
			<span className="msgPartner">{props.partner}</span>
			<span className="msgDate">{props["data"][props["data"].length-1]["timestamp"].slice(0, 10)}</span>
			<span className="msgText">{(props["data"][props["data"].length-1]["sender"] == username)? "You":props["data"][props["data"].length-1]["sender"]} : {props["data"][props["data"].length-1]["message"]}</span>
		</div>
		{messageBox? <MessageBox close={() => setMessageBox(!messageBox)} receiver={props["partner"]}/> : null}
		</>
	)
}

export default MessageLI
