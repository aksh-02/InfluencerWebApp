const globalReducer = (state, action) => {
	console.log("inGlobalReducer", state, action)
	
	switch(action.type) {
		case "TOGGLE":
			let username = null;
			try {
				username = JSON.parse(atob(document.cookie.split('; ').find(row => row.startsWith('token=')).split('.')[1]))["username"]
				console.log("username", username)
			} catch {
				console.log("username: No JWT token found")
			}
			return {loggedIn: !state.loggedIn, username: username, alert: false, alertMsg: ""}
		case "SHOWALERT":
			return {loggedIn: state.loggedIn, username: state.username, alert:true, alertMsg: action.payload}
		case "HIDEALERT":
			return {loggedIn: state.loggedIn, username: state.username, alert:false, alertMsg: state.alertMsg}
		default:
			return state
	}
  }


export default globalReducer;