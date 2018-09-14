import { Container } from 'unstated'
import { putFile, getFile } from 'blockstack'
import { v1 as generateUniqueId } from 'uuid'

// links: {
//   uniqueId: {
//     id: 'uniqueId',
//     body: 'some url',
//     isBeingEdited: false,
//   },
// },

// lists: {
//   uniqueId: {
//     id: 'uniqueId',
//     title: 'some string',
//     links: [ 'uniqueId', 'uniqueId' ],
//     isBeingEdited: false,
//   }
// },

// listOrder: [
//   'uniqueId',
//   'uniqueId'
// ],

const INITIAL_STATE = {
  links: {},
  lists: {},
  listOrder: [],
}

export default class Board extends Container {

  state = INITIAL_STATE

  // constructor () {
  //   super()
  //   putFile('STATE', JSON.stringify(INITIAL_STATE))
  // }

  refresh = () => {
    if (navigator.onLine) {
      getFile('STATE').then((state) => {
        if (state) {
          this.setState(JSON.parse(state))
        }
      }).catch((error) => {
        console.error(error)
      })
      this.online = true
    } else {
      this.online = false
    }
  }

  storeState = () => {
    putFile('STATE', JSON.stringify(this.state))
  }

  newList = () => {
    this.setState((lastState) => {
      const
        newState = { ...lastState },
        newListId = generateUniqueId()
      newState.lists[newListId] = {
        id: newListId,
        title: '',
        links: [],
        editing: true,
      }
      newState.listOrder.push(newListId)
      return newState
    }, this.storeState)
  }

  newLink = (listId) => {
    this.setState((lastState) => {
      const
        newState = { ...lastState },
        newLinkId = generateUniqueId()
      newState.links[newLinkId] = {
        id: newLinkId,
        body: '',
        isBeingEdited: true,
      }
      newState.lists[listId].links.push(newLinkId)
      return newState
    }, this.storeState)
  }

  linkOrListOperation = (id, listFn, linkFn) => (
    Object.keys(this.state.links).includes(id) && linkFn() ||
    Object.keys(this.state.lists).includes(id) && listFn() ||
    console.error(`cannot find list or link with ID of ${ id }`)
  )

  getEditingStatus = (id) => {
    return this.linkOrListOperation(id, () => {
      return this.state.lists[id].isBeingEdited
    }, () => {
      return this.state.links[id].isBeingEdited
    })
  }

  setEditingStatus = (id, truth) => {
    this.linkOrListOperation(id, () => {
      this.setState((lastState) => {
        const newState = { ...lastState }
        newState.lists[id].isBeingEdited = truth
        return newState
      }, this.storeState)
    }, () => {
      this.setState((lastState) => {
        const newState = { ...lastState }
        newState.links[id].isBeingEdited = truth
        return newState
      }, this.storeState)
    })
  }

  delete = (id) => {
    this.linkOrListOperation(id, () => {
      this.setState((lastState) => {
        const newState = { ...lastState }
        delete newState.lists[id]
        return newState
      }, this.storeState)
    }, () => {
      this.setState((lastState) => {
        const newState = { ...lastState }
        for (let key in newState.lists) {
          const deletionIndex = newState.lists[key].links.indexOf(id)
          if (deletionIndex >= 0) {
            newState.lists[key].links.splice(deletionIndex, 1)
            break
          }
        }
        delete newState.links[id]
        return newState
      }, this.storeState)
    })
  }

  get = (id) => {
    return this.linkOrListOperation(id, () => {
      return this.state.lists[id].title
    }, () => {
      return this.state.links[id].body
    })
  }

  set = (id, value) => {
    this.linkOrListOperation(id, () => {
      this.setState((lastState) => {
        const newState = { ...lastState }
        newState.lists[id].title = value
        newState.lists[id].isBeingEdited = false
        return newState
      }, this.storeState)
    }, () => {
      this.setState((lastState) => {
        const newState = { ...lastState }
        newState.links[id].body = value
        newState.links[id].isBeingEdited = false
        return newState
      }, this.storeState)
    })
  }

}