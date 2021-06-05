import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Login from './components/Login';
import Signup from './components/Signup';
import VerifiedInfluencers from './components/VerifiedInfluencers';
import ApplyAsInfluencer from './components/ApplyAsInfluencer';
import Navbar from './components/Navbar';
import MessagesBox from './components/MessagesBox';
import {useSelector} from 'react-redux'
import ActiveJobs from './components/ActiveJobs';
import CreateJob from './components/CreateJob';
import PrivateRoute from './components/PrivateRoute'
import Alert from './components/Alert';
import Profile from './components/Profile'


function App() {
  const loggedIn = useSelector(state => state.loggedIn)

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Alert />
        <Switch>
          <Route path="/signup" exact>
            <Signup />
          </Route>
          <Route path="/signin" exact>
            <Login />
          </Route>
          <PrivateRoute path='/apply'>
            <ApplyAsInfluencer />
          </PrivateRoute>
          <Route path="/" exact>
            <VerifiedInfluencers />
          </Route>
          <Route path="/influencer/:inflUsername">
            <Profile />
          </Route>
          <Route path="/jobs" exact>
            <ActiveJobs />
          </Route>
          <PrivateRoute path="/createjob" exact>
            <CreateJob />
          </PrivateRoute>
        </Switch>
        {loggedIn? <MessagesBox />:null}
      </Router>
    </div>
  );
}

export default App;
