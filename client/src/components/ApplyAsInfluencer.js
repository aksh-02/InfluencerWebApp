import React, {useState} from 'react'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import Country from './Country'
import Domains from './Domains'
import { showAlertAction } from '../actions'


function ApplyAsInfluencer() {
    const username = useSelector(state => state.username)
	const dispatch = useDispatch()
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

	// if user have already applied, don't upload his picture
	const [applied, setApplied] = useState(false)

	const endpoint = "http://localhost:8080/"
	const applySubmit = (event) => {
		event.preventDefault()

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
				withCredentials: true
		}).then(resp => {
			console.log(resp)
			if (resp.data === "You've already applied as an Influencer") {
				setApplied(true)
				dispatch(showAlertAction("You've already applied as an Influencer"))
			} else if (resp.data === "You've successfully applied as an Influencer") {
				dispatch(showAlertAction("You've successfully applied as an Influencer"))
			}
		}).catch(err => {
			console.log("err", err)
			return
		})
		
		if (applied === true) {
			setApplied(false)
			return
		}

		const blob = new Blob([JSON.stringify({username:username})], {
			type: 'application/json'
		})

		const formData = new FormData()
		if (picture === null) {
			return
		}
		formData.append('influencerPic', picture, picture.name)
		formData.append('userData', blob)

		axios.post(
			endpoint+"upload",
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true
		}).then(resp => {
			console.log(resp, "influencerPic Uploaded Successfully")
		}).catch(err => console.log("influencerPic err", err))
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
