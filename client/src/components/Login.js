import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import './Form.css'
import {useSelector, useDispatch} from 'react-redux'
import {toggleLoginAction} from '../actions'

function Login() {
    const loggedIn = useSelector(state => state.loggedIn)
    console.log('login', loggedIn)
    const dispatch = useDispatch()

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const history = useHistory()

	const endpoint = "http://localhost:8080/"
	const loginSubmit = (event) => {

		axios.post(
			endpoint+"signin",
			{
				username: username,
				password: password
			},
			{
				headers: {
				  'Content-Type': 'application/x-www-form-urlencoded'
				},
				withCredentials: true
			}).then(resp => {
				console.log(resp);
				dispatch(toggleLoginAction())
				history.push("/")
			}).catch(err => console.log("err", err))
		
		event.preventDefault()

	}

	return (
		<div>
			<form className="authForm" onSubmit={loginSubmit}>
				<input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} type="text"></input>
				<input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="text"></input>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}

export default Login
