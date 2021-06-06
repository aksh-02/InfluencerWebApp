import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import './Profile.css'
import Reviews from './Reviews'

function Profile() {
	// reviewer : the person logged in
	// inflUsername : influencer whose profile is being visited
    const reviewer = useSelector(state => state.username)

	const [influencer, setInfluencer] = useState(null)
	const [avgRating, setAvgRating] = useState(0)
	let profPic = "/influencerPictures/default-avatar.jpg"
	const { inflUsername } = useParams()

	useEffect(() => {
		axios.get(`influencer/${inflUsername}`)
		.then((resp) => {
			setInfluencer(resp.data)
			setAvgRating(avgRatingCalc())
		}).catch((err) => {
			console.log(err)
		})
	}, [])

	const [openReview, setOpenReview] = useState(false)
	const [review, setReview] = useState({
		rating: null,
		comments: ""
	})

	const submitReview = (event) => {
		axios.post(
			"submitreview",
			{
				rating: review["rating"],
				comments: review["comments"],
				influencerName: influencer.username,
				reviewer: reviewer
			},
		{
			headers: {
			  'Content-Type': 'application/x-www-form-urlencoded'
			},
			withCredentials: true
		}).then(resp => {
			console.log(resp.data)
			setOpenReview(false)
		}).catch(err => {
			console.log(err)
		})
		event.preventDefault()
	}

	const avgRatingCalc = () => {
		if (influencer.reviews.length === 0) {
				return 0
		}
		let totalRating = 0;
		for (let i = 0; i < influencer.reviews.length; i++) {
			totalRating += influencer.reviews[i].rating;
		}
		return totalRating/influencer.reviews.length
	}


	console.log("influencer", influencer, avgRating)
	return (
		<>
			{(influencer !== null)?
			<div>
				<div className="inflDetails">
					<header>Details</header>
					<img className="inflProfileImage" alt="Avatar" src={(influencer.profilePicture==="")?profPic:"/influencerPictures/" + influencer.profilePicture.split('\\')[4]}></img>
					<span>Username : {influencer.username}</span>
					<span>Name : {influencer.name}</span>
					<span>About : {influencer.about || "NA"}</span>
					<span>Domains : {(influencer.domains.length !== 0)? influencer.domains:"NA"}</span>
					<span>Country : {influencer.Country || "NA"}</span>
				</div>
				<div className="inflStats">
					<span className="statsHeader">Influencer Stats</span>
					<hr />
					<span>Rank : {influencer.stats.rank || "NA"}</span>
					<span>Reach : {influencer.stats.reach || "NA"}</span>
				</div>
				<div className="inflReviews">
					<span className="avgRating">Average Rating : {avgRating}</span>
					<hr />
					{openReview?
					<form className="reviewForm" onSubmit={submitReview}>
						<input type="number" placeholder="Rating" onChange={(e) => setReview({...review, rating:e.target.value})} min="0" step="1" />
						<textarea placeholder="Comments" onChange={(e) => setReview({...review, comments:e.target.value})} name="comments" type="text" />
						<button className="submitBtn" type="submit">Submit</button>
						<button className="cancelBtn" onClick={() => setOpenReview(false)}>Cancel</button>
					</form>
					:
					<div>
						{(influencer.reviews.length===0)?<h2 className="nra">No reviews available</h2>:<Reviews reviews={influencer.reviews} />}
						<button className="reviewBtn" onClick={() => setOpenReview(true)}>Review {influencer.name}</button>
					</div>}
				</div>
			</div>
			:null}
		</>
	)
}
export default Profile
