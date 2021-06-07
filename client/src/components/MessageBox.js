import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import {useSelector} from 'react-redux'
import './MessageBox.css'

const MessageBox = (props) => {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState([])
    const username = useSelector(state => state.username)
	console.log("rec", props.receiver)

	const endpoint = "http://localhost:8080/"
	const checkMessages = () => {
		axios.post(
			endpoint+"checkmessages",
			{
				sender: username,
				receiver: props.receiver
			},
			{
				headers: {
				  'Content-Type': 'application/x-www-form-urlencoded'
				},
				withCredentials: true
		}).then(resp => {
			console.log(resp)
			if (resp.data != null) {
				setMessages(resp.data)
			}
		}).catch(err => {
			console.log("err", err)
			return
		})
	}

	const messagesEndRef = useRef(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const sendMessage = (event) => {
		axios.post(
			endpoint+"sendmessage",
			{
				message: message,
				sender: username,
				receiver: props.receiver
			},
			{
				headers: {
				  'Content-Type': 'application/x-www-form-urlencoded'
				},
				withCredentials: true
		}).then(resp => {
			setMessage("")
			console.log(resp)
		}).catch(err => {
			console.log("err", err)
			return
		})

		checkMessages()
		event.preventDefault()
	}

	checkMessages()
	
	return ReactDOM.createPortal(
		<div className="messageBox">
		<header>
			<section>
				{props.receiver}
			</section>
			<section>
				<button className="close" onClick={() => props.close()}>X</button>
			</section>
		</header>
		<div className="prevMessages">
			{messages.map((message) =>
				<div className={(message.sender===username)? "sent":"received"} key={message._id}>{message.message}</div>
			)}
			<div ref={messagesEndRef} />
		</div>
		<button onClick={checkMessages}>Check Messages</button>
		<form onSubmit={sendMessage}>
			<input value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
			<button type="submit">Send</button>
		</form>
	</div>, document.getElementsByClassName('App')[0]
	)

}

export default MessageBox