import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import globalReducer from './reducers/globalReducer'


export let initialStore = {loggedIn: false, username: null, alert: false, alertMsg: ""}
try {
  let username = JSON.parse(atob(document.cookie.split('; ').find(row => row.startsWith('token=')).split('.')[1]))["username"]
  initialStore["username"] = username
  initialStore["loggedIn"] = true
} catch {
  console.log("username: No JWT token found")
}

console.log("In Index", initialStore)

// Redux STORE
let store = createStore(globalReducer,
  initialStore,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// subscribe adds a change listener. It's called any time an action is dispatched
store.subscribe(() => console.log(`In Index getState: ${store.getState()}`))




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
