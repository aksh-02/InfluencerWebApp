const toggleLoginReducer = (state, action) => {

	switch(action.type) {
		case "TOGGLE":
			let username = null;
			try {
				username = JSON.parse(atob(document.cookie.split('; ').find(row => row.startsWith('token=')).split('.')[1]))["username"]
				console.log("username", username)
			} catch {
				console.log("username: No JWT token found")
			}
			return {loggedIn: !state.loggedIn, username: username}
		default:
			return state
	}
  }


export default toggleLoginReducer;