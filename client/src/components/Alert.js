import React, {useState, useEffect} from 'react'
import "./Alert.css"
import {useSelector, useDispatch} from 'react-redux'
import {hideAlertAction} from '../actions'


function Alert() {
	const alert = useSelector(state => state.alert)
	const alertMsg = useSelector(state => state.alertMsg)
    const dispatch = useDispatch()

	const [showAlert, setShowAlert] = useState(false)

	useEffect(() => {
		setShowAlert(alert)
	}, [alert])

	const transition = () => {
		console.log("InAlert", showAlert)
		dispatch(hideAlertAction())
	}
	
	console.log("alertMsg in Alert", alertMsg)
	return (
		<div className={`alert ${showAlert? 'alert-shown':'alert-hidden'}`} onTransitionEnd={transition}>{alertMsg}</div>
	)
}

export default Alert
