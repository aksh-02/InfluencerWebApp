import React, {useState, useEffect} from 'react'
import './InfluencerLI.css'
import MessageBox from './MessageBox'

function InfluencerLI(props) {
	const [messageBox, setMessageBox] = useState(false)
	const [drop, setDrop] = useState(false)
	let profilePicture = "influencerPictures/default-avatar.jpg"
	try {
		profilePicture = "influencerPictures/" + props.influencer.profilePicture.split('\\')[4]
	} catch {
		
	}

	useEffect(() => {
		if (drop === true) {
			document.addEventListener('click', closeDrop);
		}
	}, [drop])
	  
	const closeDrop = () => {
		setDrop(false)
		document.removeEventListener('click', closeDrop);
	}

	return (
		<>
		<div className="influencerLI">
			<img className="influencerLIImage" alt="Avatar" src={profilePicture}></img>
			<span>{props.influencer.name}</span>
			<button onClick={() => setDrop(!drop)} className="dropBtn">Social {drop?"▲":"▼"}</button>
			{drop? 
  			<div className="social">
			  	<a target="_blank" rel="noreferrer" href={props.influencer.social.instagram}>Instagram</a>
				<a target="_blank" rel="noreferrer" href={props.influencer.social.twitter}>Twitter</a>
				<a target="_blank" rel="noreferrer" href={props.influencer.social.youtube}>Youtube</a>
  			</div>:null}
			<button className="msgBtn" onClick={() => setMessageBox(!messageBox)}>Message</button>
		</div>
		{messageBox? <MessageBox close={() => setMessageBox(!messageBox)} receiver={props.influencer.username}/> : null}
		</>

	)
}

export default InfluencerLI
