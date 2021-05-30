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


function App() {
  const loggedIn = useSelector(state => state.loggedIn)
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/signup" exact>
            <Signup />
          </Route>
          <Route path="/signin" exact>
            <Login />
          </Route>
          <Route path="/apply" exact>
            < ApplyAsInfluencer />
          </Route>
          <Route path="/" exact>
            <VerifiedInfluencers />
          </Route>
          <Route path="/jobs" exact>
            <ActiveJobs />
          </Route>
          <Route path="/createjob" exact>
            <CreateJob />
          </Route>
        </Switch>
        {loggedIn? <MessagesBox />:null}
      </Router>
    </div>
  );
}

export default App;
