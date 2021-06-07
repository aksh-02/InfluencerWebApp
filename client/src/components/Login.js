import React, {useState, useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import axios from 'axios'
import './Form.css'
import {useDispatch} from 'react-redux'
import {showAlertAction, toggleLoginAction} from '../actions'

function Login() {
    const dispatch = useDispatch()

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const history = useHistory()

	const {state} = useLocation()
	useEffect(() => {
		if (state === undefined) {
			return
		} else if (state.from.pathname === "/apply") {
			console.log("from apply")
			dispatch(showAlertAction("Redirecting to login page"))
		} else if (state.from.pathname === "/createjob") {
			dispatch(showAlertAction("Redirecting to login page"))
		}
	}, [state])

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
				dispatch(showAlertAction("You've successfully Logged IN"))
				history.push("/")
			}).catch(err => {
				if (err.response.status === 401) {
					dispatch(showAlertAction("Username or password is incorrect"))
				}
				console.log("err", err, err.response.status)
			})
		
		event.preventDefault()

	}

	return (
		<div>
			<form className="authForm" onSubmit={loginSubmit}>
				<input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} type="text"></input>
				<input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password"></input>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}

export default Login
