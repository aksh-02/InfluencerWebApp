import React, {useState, useEffect} from 'react'
import axios from 'axios'
import InfluencerLI from './InfluencerLI'
import FilterInfluencers from './FilterInfluencers'
import './Helper.css'

const VerifiedInfluencers = () => {
	const [vInfl, setVInfl] = useState([])
	const [options, setOptions] = useState(null)

	const getOptions = (ops) => {
		if (ops["country"] !== "") {
			setOptions({country:ops["country"], domains:ops["domains"]})
		} else {
			setOptions({domains:ops["domains"]})
		}
	}

	useEffect(() => {
		axios.get("http://localhost:8080",
		{
			params:options
		}).then(resp => {
			setVInfl(resp.data)
			console.log(resp)
		}).catch(err => console.log("err", err))
	}, [options])

	console.log("InVer", options)
	return (
		<>
		<FilterInfluencers passOptions={getOptions} />
		{(vInfl !== null)?
		<div className="longList">
			{vInfl.map((infl) => <InfluencerLI key={infl._id} influencer={infl} />)}
		</div>
		:
		<h2>No Influencers to show</h2>}
		</>
	)
}

export default VerifiedInfluencers