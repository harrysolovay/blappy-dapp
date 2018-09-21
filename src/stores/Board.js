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

// const TEST_STATE = {
//   // tasks > links
//   // content > body
//   links: {
//     'task-1': { id: 'task-1', body: 'Take out the garbage', isBeingEdited: true },
//     'task-2': { id: 'task-2', body: 'Watch my favorite show', isBeingEdited: true },
//     'task-3': { id: 'task-3', body: 'Charge my phone', isBeingEdited: true },
//     'task-4': { id: 'task-4', body: 'Cook dinner', isBeingEdited: true },
//   },
//   // columns > lists
//   // taskIds > linkIds
//   lists: {
//     'column-1': {
//       id: 'column-1',
//       title: 'To do',
//       linkIds: ['task-1', 'task-2', 'task-3', 'task-4'],
//       isBeingEdited: true,
//     },
//     'column-2': {
//       id: 'column-2',
//       title: 'In progress',
//       linkIds: [],
//       isBeingEdited: true,
//     },
//   },
//   // Facilitate reordering of the columns
//   listOrder: ['column-1', 'column-2'],
// }

export default class Board extends Container {

  state = INITIAL_STATE

  // constructor () {
  //   super()
  //   putFile('STATE', JSON.stringify(this.state))
  // }

  refresh = () => {
    console.log('the retrieved state')
    getFile('STATE').then((state) => {
      if (state) {
        this.setState(() => JSON.parse(state))
      }
    }).catch((error) => {
      console.error(error)
    })
    // console.log('not refreshing ;)')
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
        linkIds: [],
        isBeingEdited: true,
      }
      newState.listOrder.push(newListId)
      return newState
    }, this.storeState)
  }

  newLink = (listId) => {
    this.setState((lastState) => {
      const newState = { ...lastState }
      const newLinkId = generateUniqueId()
      newState.links[newLinkId] = {
        id: newLinkId,
        body: '',
        isBeingEdited: true,
      }
      newState.lists[listId].linkIds.push(newLinkId)
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
        const deletionIndex = newState.listOrder.indexOf(id)
        if (deletionIndex >= 0) {
          newState.listOrder.splice(deletionIndex, 1)
        }
        return newState
      }, this.storeState)
    }, () => {
      this.setState((lastState) => {
        const newState = { ...lastState }
        for (let key in newState.lists) {
          const deletionIndex = newState.lists[key].linkIds.indexOf(id)
          if (deletionIndex >= 0) {
            newState.lists[key].linkIds.splice(deletionIndex, 1)
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

  onDragEnd = (result) => {

    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'list') {
      const newColumnOrder = Array.from(this.state.listOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)
      const newState = {
        ...this.state,
        listOrder: newColumnOrder,
      }
      this.setState(newState, this.storeState)
      return
    }

    const home = this.state.lists[source.droppableId]
    const foreign = this.state.lists[destination.droppableId]

    if (home === foreign) {
      const newTaskIds = Array.from(home.linkIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newHome = {
        ...home,
        linkIds: newTaskIds,
      }

      const newState = {
        ...this.state,
        lists: {
          ...this.state.lists,
          [newHome.id]: newHome,
        },
      }

      this.setState(newState, this.storeState)
      return
    }

    // moving from one list to another
    const homeTaskIds = Array.from(home.linkIds)
    homeTaskIds.splice(source.index, 1)
    const newHome = {
      ...home,
      linkIds: homeTaskIds,
    }

    const foreignTaskIds = Array.from(foreign.linkIds)
    foreignTaskIds.splice(destination.index, 0, draggableId)
    const newForeign = {
      ...foreign,
      linkIds: foreignTaskIds,
    }

    const newState = {
      ...this.state,
      lists: {
        ...this.state.lists,
        [newHome.id]: newHome,
        [newForeign.id]: newForeign,
      },
    }
    this.setState(newState, this.storeState)
  }

}