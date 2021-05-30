import React, {useState} from 'react'
import axios from 'axios'
import {useSelector} from 'react-redux'



function ApplyAsInfluencer() {
    const username = useSelector(state => state.username)
	console.log("apply", username)

	const [name, setName] = useState("")
	const [picture, setPicture] = useState(null)
	const [instagram, setInstagram] = useState("")
	const [twitter, setTwitter] = useState("")
	const [youtube, setYoutube] = useState("")

	const endpoint = "http://localhost:8080/"
	const applySubmit = (event) => {
		axios.post(
			endpoint+"apply",
			{
				username: username,
				name: name,
				instagram: instagram,
				twitter: twitter,
				youtube: youtube
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
		

		const blob = new Blob([JSON.stringify({username:username})], {
			type: 'application/json'
		})

		const formData = new FormData()
		formData.append('influencerPic', picture, picture.name)
		formData.append('userData', blob)

		axios.post(
			endpoint+"upload",
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				  }
		}).then(resp => {
			console.log(resp, "influencerPic Uploaded Successfully")
		}).catch(err => console.log("influencerPic err", err))

		event.preventDefault()

	}

	return (
		<div>
			<h2>Apply as an Influencer</h2>
			<form className="authForm" onSubmit={applySubmit}>
				<input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
				<div className="fileInput">
					<span>Profile Picture </span>
					<input onChange={(e) => setPicture(e.target.files[0])} type="file" />
				</div>
				<input placeholder="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} type="text" />				
				<input placeholder="Twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} type="text" />
				<input placeholder="Youtube" value={youtube} onChange={(e) => setYoutube(e.target.value)} type="text" />
				<button type="submit">Submit</button>
			</form>
		</div>
	)

}

export default ApplyAsInfluencer
