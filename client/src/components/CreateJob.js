import React, {useState} from 'react'
import axios from 'axios'
import {useSelector} from 'react-redux'
import './CreateJob.css'

function CreateJob() {
    const username = useSelector(state => state.username)
	console.log("createJob", username)

	const [title, setTitle] = useState("")
	const [details, setDetails] = useState("")
	const [compensation, setCompensation] = useState("")

	const endpoint = "http://localhost:8080/"
	const createJobSubmit = (event) => {
		axios.post(
			endpoint+"createjob",
			{
				title: title,
				details: details,
				postedby: username,
				compensation: compensation
			},
			{
				headers: {
				  'Content-Type': 'application/x-www-form-urlencoded'
				},
				// withCredentials: true
		}).then(resp => {
			console.log(resp)
		}).catch(err => {
			console.log("err", err)
			return
		})
		
		event.preventDefault()

	}

	return (
		<div>
			<h2>Create New Job</h2>
			<form className="createJobForm" onSubmit={createJobSubmit}>
				<input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" />
				<input placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} type="text" />				
				<input placeholder="Compensation" value={compensation} onChange={(e) => setCompensation(e.target.value)} type="text" />
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}

export default CreateJob

