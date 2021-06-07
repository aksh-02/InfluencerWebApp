import React, {useState, useEffect} from 'react'
import axios from 'axios'
import JobLI from './JobLI'


const ActiveJobs = () => {
	const [aJobs, setAJobs] = useState([])

	const endpoint = "http://localhost:8080/"
	useEffect(() => {
		axios.get(endpoint+"jobs",
		// {withCredentials: true}
		).then(resp => {
			setAJobs(resp.data)
			console.log(resp)
		}).catch(err => console.log("err", err))
	}, [])

	return (
		<div className="longList">
			{aJobs.map((job) => <JobLI key={job._id} job={job} />)}
		</div>
	)

}

export default ActiveJobs