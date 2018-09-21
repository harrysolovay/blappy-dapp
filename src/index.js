import { Component } from 'react'
import { render } from 'react-dom'
import {
  setGlobalStyles,
  registerServiceWorker,
} from '~/utilities'
import { Provider, Subscribe } from 'unstated'
import { User as UserStore } from '~/stores'
import { Board, LogIn } from '~/pages'

setGlobalStyles()

class App extends Component {
  render () {
    return (
      <Provider>
        <Subscribe to={[ UserStore ]}>
          {(user) => {
            console.log('the user', user)
            return (
              user.state.loading
                ? <div>Loading</div>
                : user.state.loggedIn
                  ? <Board />
                  : <LogIn />
            )
          }}
        </Subscribe>
      </Provider>
    )
  }
}


const root = document.getElementById('root')
if (root) {
  render(<App />, root)
  registerServiceWorker()
}