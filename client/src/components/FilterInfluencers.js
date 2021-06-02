import React, {useState, useEffect} from 'react'
import './FilterInfluencers.css'
import Country from './Country'
import Domains from './Domains'

function FilterInfluencers(props) {
	const [open, setOpen] = useState(false)
	const [options, setOptions] = useState({
		country: "",
		domains: []
	})

	useEffect(() => {
        const query = new URLSearchParams(
            window.location.search
        );

        let domains = []
		let country = ""
        for (let param of query.entries()) {
			if (param[0] === "country") {
				country = param[1]
			} else {
				domains.push(param[1])
			}
        }
		setOptions({country:country, domains:domains})
		props.passOptions({country:country, domains:domains})
	}, [])

	const handleCountryChange = (e) => {
		setOptions({...options, country:e.target.value})
	}

	const handleDomainsChange = (e) => {
		let values = Array.from(e.target.selectedOptions, option => option.value)
		setOptions({...options, domains:values})
	}

	const applyFilters = (event) => {
	}

	console.log("ops", options.country, options.domains)
	return (
		<div>
			<button className="openBtn" onClick={() => setOpen(true)}>&#9776; Filter</button>
			<div className={open?"sidepanelOpen":"sidepanelClosed"}>
  				<button className="closeBtn" onClick={() => setOpen(false)}>&times;</button>
				<form onSubmit={applyFilters}>
					<Country handlechange={handleCountryChange} />
					<Domains handlechange={handleDomainsChange} />
					<button type="submit">Apply Filters</button>
				</form>
			</div>
		</div>
	)
}

export default FilterInfluencers
