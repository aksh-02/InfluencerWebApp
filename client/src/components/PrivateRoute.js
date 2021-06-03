import React from 'react'
import {useSelector} from 'react-redux'
import {Route, Redirect} from 'react-router-dom'

function PrivateRoute ({ children, ...rest }) {
	const loggedIn = useSelector(state => state.loggedIn)

	return (
	  	<Route {...rest} render={({ location }) => 
		(loggedIn === true)? children:<Redirect to={{
            pathname: '/signin',
            state: { from: location }
          }} />
		} />
	)
}

export default PrivateRoute
