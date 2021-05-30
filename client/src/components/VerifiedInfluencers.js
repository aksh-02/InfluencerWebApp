import React, {useState, useEffect} from 'react'
import axios from 'axios'
import InfluencerLI from './InfluencerLI'

const VerifiedInfluencers = () => {
	const [vInfl, setVInfl] = useState([])

	const endpoint = "http://localhost:8080/"
	useEffect(() => {
		axios.get(endpoint,
		// {withCredentials: true}
		).then(resp => {
			setVInfl(resp.data)
			console.log(resp)
		}).catch(err => console.log("err", err))
	}, [])

	return (
		<div>
			{vInfl.map((infl) => <InfluencerLI key={infl._id} influencer={infl} />)}
		</div>
	)
}

export default VerifiedInfluencers