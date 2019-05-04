import React, { Component } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Link, Redirect, withRouter} from 'react-router-dom'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(callback) {
    this.isAuthenticated =true
    setTimeout(callback, 100)
  },
  signout(callback) {
    this.isAuthenticated = false
    setTimeout(callback, 100)
  }
}

const Public = () => <h3>public</h3>
const Protected = () => <h3>protected</h3>

class Login extends Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  render() {
    const { redirectToReferrer } = this.state
    const {from} = this.props.location.state || {from: {pathname: '/'}}

    if (redirectToReferrer === true) {
      return (
        <Redirect to={from}/>
      )
    }
    return (
      <div>
        <p>You must be logged in to view this page at {from.pathname}</p>
        <button onClick={this.login}>Login</button>
      </div>
    )
  }
}

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated ===true
    ? <Component {...props}/>
    : <Redirect to={{
      pathname:'/login',
      state: {from: props.location}
    }}/>
  )}/>
)

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated === true
  ? <p>
    Welcome! <button onClick={() => {
      fakeAuth.signout(() => history.push('/'))
    }}>Sign Out</button>
  </p>
  :<p>You are not logged in.</p>
))

class App extends Component {
  render() {
    return (
    <Router>
      <div>
        <AuthButton />
        <ul>
          <li><Link to='/public'>Public Page</Link></li>
          <li><Link to='/protected'>Protected Page</Link></li>
        </ul>
        <Route path='/public' component={Public}/>
        <Route path='/login' component={Login}/>
        <PrivateRoute path='/protected' component={Protected}/>
      </div>
    </Router>
    )
  }
}

export default App
