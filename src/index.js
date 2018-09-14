import { Component } from 'react'
import { render } from 'react-dom'
import {
  setGlobalStyles,
  registerServiceWorker,
} from '~/utilities'
import { Provider, Subscribe } from 'unstated'
import {
  User as UserStore,
  Board as BoardStore,
} from '~/stores'
import { Board, LogIn } from '~/pages'

setGlobalStyles()

class App extends Component {
  render () {
    return (
      <Provider>
        <Subscribe
          to={[
            UserStore,
            BoardStore,
          ]}
        >
          {(user, board) => (
            !user.state.loading && !board.state.loading
              ? user.state.loggedIn
                ? <Board />
                : <LogIn />
              : <div>Loading</div>
          )}
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