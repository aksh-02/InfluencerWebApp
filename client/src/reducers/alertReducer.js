const alertReducer = (state, action) => {
	switch(action.type) {
		case "SHOWALERT":
			return {loggedIn: !state.loggedIn, username: state.username, alert: false, alertMsg: ""}
		case "HIDEALERT":
			return {loggedIn: !state.loggedIn, username: state.username, alert: false, alertMsg: ""}
		default:
			return state
	}
  }


export default alertReducer;