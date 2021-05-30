import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import toggleLoginReducer from './reducers/isLogged'


let userData = {loggedIn: false, username: null}
try {
  let username = JSON.parse(atob(document.cookie.split('; ').find(row => row.startsWith('token=')).split('.')[1]))["username"]
  userData["username"] = username
  userData["loggedIn"] = true
} catch {
  console.log("username: No JWT token found")
}

console.log("In Index", userData)

// Redux STORE
let store = createStore(toggleLoginReducer,
  userData,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// subscribe adds a change listener. It's called any time an action is dispatched
// store.subscribe(() => console.log(`LoggedIN: ${store.getState()}`))




ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
