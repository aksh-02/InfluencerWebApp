import React, {useState} from 'react'
import './InfluencerLI.css'
import MessageBox from './MessageBox'

function InfluencerLI(props) {
	const [messageBox, setMessageBox] = useState(false)
	let profilePicture = "influencerPictures/default-avatar.jpg"
	try {
		profilePicture = "influencerPictures/" + props.influencer.profilePicture.split('\\')[4]
	} catch {
		
	}

	return (
		<>
		<div className="influencerLI">
			<img className="influencerLIImage" alt="Avatar" src={profilePicture}></img>
			<span>{props.influencer.name}</span>
			<div className="social">
				<a target="_blank" rel="noreferrer" href={props.influencer.instagram}>Instagram</a>
				<a target="_blank" rel="noreferrer" href={props.influencer.twitter}>Twitter</a>
				<a target="_blank" rel="noreferrer" href={props.influencer.youtube}>Youtube</a>
			</div>
			<button onClick={() => setMessageBox(!messageBox)}>Message</button>
		</div>
		{messageBox? <MessageBox close={() => setMessageBox(!messageBox)} receiver={props.influencer.username}/> : null}
		</>

	)
}

export default InfluencerLI
