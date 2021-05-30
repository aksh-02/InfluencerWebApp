import React, {useState} from 'react'
import MessagesList from './MessagesList'
import './MessagesBox.css'

function MessagesBox() {
	const [open, setOpen] = useState(false)
	

	return (
		<div className="messagesBox">
			<header>
				<section>
					Messaging
				</section>
				<section>
					<button onClick={() => {setOpen(!open)}}>{open? "Close":"Open"}</button>
				</section>
			</header>
			{open? <MessagesList /> : null}
		</div>
	)
}

export default MessagesBox
