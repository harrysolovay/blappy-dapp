import { Container } from 'unstated'
import {
  redirectToSignIn,
  isUserSignedIn,
  isSignInPending,
  handlePendingSignIn,
  loadUserData,
  signUserOut,
} from 'blockstack'

const INITIAL_STATE = {
  isLoading: true,
  loggedIn: false,
  username: null,
  name: null,
}

export default class User extends Container {

  state = INITIAL_STATE

  getInfo = ({
    username,
    profile: {
      name,
    },
  } = loadUserData()) => ({
    username,
    name,
  })

  logIn = () => {
    const origin = window.location.origin
    redirectToSignIn(origin, `${ origin }/manifest.json`, [
      'store_write',
      'publish_data',
    ])
  }

  logOut = () => {
    signUserOut(window.location.origin)
    this.refresh()
  }

  refresh = async () => {

    this.setState((lastState) => ({
      ...lastState,
      isLoading: true,
    }))

    if (isSignInPending()) {
      try {
        const user = await handlePendingSignIn()
        if (user) {
          this.setState((lastState) => ({
            ...lastState,
            ...this.getInfo(user),
            loggedIn: true,
            isLoading: false,
          }))
        }
      } catch (error) {
        console.error(`error related to handlePendingSignIn call: ${ error }`)
      }
    }
  
    else if (isUserSignedIn()) {
      this.setState((lastState) => ({
        ...lastState,
        ...this.getInfo(),
        loggedIn: true,
        isLoading: false,
      }))
    }
  
    else {
      this.setState((lastState) => ({
        ...lastState,
        ...this.initialState,
        loggedIn: false,
        isLoading: false,
      }))
    }
  }

}