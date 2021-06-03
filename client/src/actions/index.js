export const toggleLoginAction = () => {
	return {
	  type: 'TOGGLE'
	}
}

export const showAlertAction = (msg) => {
	return {
		type: 'SHOWALERT',
		payload: msg
	}
}

export const hideAlertAction = () => {
	return {
		type: 'HIDEALERT'
	}
}
