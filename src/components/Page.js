import { Component } from 'react'
import { Subscribe } from 'unstated'
import { User as UserStore } from '~/stores'

class Page extends Component {

  render () {
    return (
      <div>
        { this.props.children }
      </div>
    )
  }
 
  componentDidMount () {
    this.props.userStore.refresh()
  }

}

export default (props) =>
  <Subscribe to={[ UserStore ]}>
    {(userStore) => (
      <Page
        { ...{ userStore } }
        { ...props }
      />
    )}
  </Subscribe>