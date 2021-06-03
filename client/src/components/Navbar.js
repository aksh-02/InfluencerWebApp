import React from 'react'
import {useHistory, withRouter, Link} from 'react-router-dom'
import axios from 'axios';
import './Navbar.css'
import {useSelector, useDispatch} from 'react-redux'
import {toggleLoginAction} from '../actions'

function Navbar() {
    const loggedIn = useSelector(state => state.loggedIn)
    console.log('nav', loggedIn)
    const dispatch = useDispatch()
    
	const endpoint = "http://localhost:8080/"
    const history = useHistory()

    const logoutHandler = () => {
        axios.get(endpoint+"logout", {withCredentials: true}).then(resp => {
            console.log(resp);
            dispatch(toggleLoginAction())
			history.push("/signin")
        }).catch(err => {console.log(err)})
    }

	return (
        <div className="navbar">
            <Link to="/">Influencers</Link>
            <Link to="/jobs">Jobs</Link>
            <div className="navbar-right">
                {loggedIn ? 
                    <>
                    <Link to="/createjob">Create New Job</Link>
                    <Link to="/apply">Influencer Status</Link>
                    <button onClick={logoutHandler}>
                        <img className="logoutIcon" src='/logout.svg' alt='Logout' />
                    </button>
                    </>
                    : 
                    <>
                    <Link to="/signup">Signup</Link>
                    <Link to="/signin">Login</Link>
                    </>
                }
            </div>
        </div>
	)
}

export default withRouter(Navbar)
