import React from 'react'

function Domains(props) {
	return (
		<div className="domains">
			<span>Domains</span>
			<select name="domains[]" multiple onChange={(e) => props.handlechange(e)}>
				<option disabled value>Select</option>
				<option value="Art">Art</option>
				<option value="Beauty">Beauty</option>
				<option value="Crypto">Crypto</option>
				<option value="Food">Food</option>
				<option value="Gaming">Gaming</option>
				<option value="Movie">Movie</option>
				<option value="Sports">Sports</option>
				<option value="Travel">Travel</option>
			</select>
		</div>
	)
}

export default Domains
