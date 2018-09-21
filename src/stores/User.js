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

    if (isSignInPending()) {
      try {
        const user = await handlePendingSignIn()
        if (user) {
          this.setState(() => ({
            ...this.getInfo(user),
            loggedIn: true,
          }))
        }
      } catch (error) {
        console.error(`error related to handlePendingSignIn call: ${ error }`)
      }
    }
  
    else if (isUserSignedIn()) {
      this.setState(() => ({
        ...this.getInfo(),
        loggedIn: true,
      }))
    }
  
    else {
      this.setState(() => ({
        ...this.initialState,
        loggedIn: false,
      }))
    }
  }

}