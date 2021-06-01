import React, {useState} from 'react'
import './JobLI.css'
import MessageBox from './MessageBox'

function JobLI(props) {
	const [messageBox, setMessageBox] = useState(false)
	const [show, setShow] = useState(false)

	return (
		<>
		<div className="jobLI">
			<header className="jobLIHeader" onClick={() => setShow(!show)}>
				<section className="jobLITitle">{props.job.title}</section>
				<section className="jobCompensation">Budget : {props.job.compensation}</section>
			</header>
			{show? 
			<>
			<div>{props.job.details}</div>
			<button onClick={() => setMessageBox(!messageBox)}>Contact</button>
			</>
			:null}

		</div>
		{messageBox? <MessageBox close={() => setMessageBox(!messageBox)} receiver={props.job.postedby}/> : null}
		</>

	)
}

export default JobLI
