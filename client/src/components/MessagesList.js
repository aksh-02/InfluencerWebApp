import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useSelector} from 'react-redux'
import MessageLI from './MessageLI'


function MessagesList() {
    const username = useSelector(state => state.username)
	const [messages, setMessages] = useState([])

	useEffect(() => {
		axios.post(
			"checkallmessages",
			{
				username: username,
			},
			{
				headers: {
				  'Content-Type': 'application/x-www-form-urlencoded'
				},
				// withCredentials: true
		}).then(resp => {
			console.log(resp)
			if (resp.data != null) {
				setMessages(resp.data)
			}
		}).catch(err => {
			console.log("err", err)
			return
		})
	}, [username])


	return (
		<div>
			{Object.keys(messages).map((partner) => <MessageLI key={partner} partner={partner} data={messages[partner]} />)}
		</div>
	)
}

export default MessagesList
