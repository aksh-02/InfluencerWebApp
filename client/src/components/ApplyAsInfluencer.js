import React, {useState} from 'react'
import axios from 'axios'
import {useSelector} from 'react-redux'
import Country from './Country'
import Domains from './Domains'


function ApplyAsInfluencer() {
    const username = useSelector(state => state.username)
	console.log("apply", username)

	const [influencer, setInfluencer] = useState({
		name: "",
		about: "",
		country: "",
		domains: [],
	})

	const handleChange = (e) => {
		setInfluencer({...influencer, [e.target.name]:e.target.value})
	}

	const [social, setSocial] = useState({
		instagram: "",
		twitter: "",
		youtube: ""
	})

	const socialHandleChange = (e) => {
		setSocial({...social, [e.target.name]:e.target.value})
	}

	const [picture, setPicture] = useState(null)

	const endpoint = "http://localhost:8080/"
	const applySubmit = (event) => {
		axios.post(
			endpoint+"apply",
			{
				username: username,
				name: influencer.name,
				country: influencer.country,
				domains: influencer.domains,
				about: influencer.about,
				social: {
					instagram: social.instagram,
					twitter: social.twitter,
					youtube: social.youtube
				}
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
				<input placeholder="Name" name="name" value={influencer.name} onChange={handleChange} type="text" />
				<textarea placeholder="About" name="about" value={influencer.about} onChange={handleChange} type="text" />
				<div className="fileInput">
					<span>Profile Picture </span>
					<input onChange={(e) => setPicture(e.target.files[0])} type="file" />
				</div>
				<Country name="country" handlechange={handleChange} />
				<Domains name="domains" handlechange={(e) => {
					let values = Array.from(e.target.selectedOptions, option => option.value)
					setInfluencer({...influencer, domains:values})
					}} />
				<input placeholder="Instagram" name="instagram" value={social.instagram} onChange={socialHandleChange} type="text" />
				<input placeholder="Twitter" name="twitter" value={social.twitter} onChange={socialHandleChange} type="text" />
				<input placeholder="Youtube" name="youtube" value={social.youtube} onChange={socialHandleChange} type="text" />
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}

export default ApplyAsInfluencer
