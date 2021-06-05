import React, {useState} from 'react'
import './Reviews.css'

function Reviews({reviews}) {
	const [index, setIndex] = useState(0)



	console.log("index", index)
	return (
		<div className="reviews">
			{reviews.map((review, ind) => 
				(ind===index)?<div className="review" key={ind}>
					<span className="rating">Rating : {review.rating}</span>
					<span className="comments">Comments : {review.comments}</span>
					<span className="reviewer">By : {review.reviewer}</span>
				</div>:null
			)}
			<br />
			<button className="prev" onClick={() => setIndex((index-1)%reviews.length)}>&#10094;</button>
  			<button className="next" onClick={() => setIndex((index+1)%reviews.length)}>&#10095;</button>
		</div>
	)
}

export default Reviews
