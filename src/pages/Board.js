import styled from 'styled-components'
import { Component, Fragment } from 'react'
import { Subscribe } from 'unstated'
import { Board as BoardStore } from '~/stores'
import {
  Page,
  Toolbar,
  Button,
  EditableDisplay,
  List,
} from '~/components'
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd'

const Container = styled.div`
  margin-top: 64px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 600px) {
    flex-direction: row;
  }
`


class Board extends Component {

  onDragEnd = (e) => {

    const {
      destination,
      source,
      draggableId,
    } = e
    
    if (
      !destination ||
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    console.log('destination', destination, 'source', source, 'draggableId', draggableId)

  }

  render () {
    return (
      <Page>
        <Fragment>
          <Toolbar />
          <DragDropContext onDragEnd={ this.onDragEnd }>
            <Container>
              {
                Object.keys(this.props.boardStore.state.listOrder).length >= 1 &&
                  Object.values(this.props.boardStore.state.listOrder).map((listId) => (

                    <div>
                      <List key={ listId }>
                        <EditableDisplay
                          boardStore={ this.props.boardStore }
                          id={ listId }
                        />
                        <div>
                          <Droppable droppableId={ listId }>
                            {(linkDroppableProvided) => (
                              <div
                                ref={ linkDroppableProvided.innerRef }
                                { ...linkDroppableProvided.droppableProps }
                              >
                                {
                                  Object.values(this.props.boardStore.state.lists[listId].links).length >= 1 &&
                                    Object.values(this.props.boardStore.state.lists[listId].links).map((linkId, index) => (
                                      <Draggable
                                        key={ linkId }
                                        draggableId={ linkId }
                                        { ...{ index }}
                                      >
                                        {(linkDraggableProvided) => (
                                          <div
                                            { ...linkDraggableProvided.draggableProps }
                                            { ...linkDraggableProvided.dragHandleProps }
                                            ref={ linkDraggableProvided.innerRef }
                                          >
                                            <EditableDisplay
                                              boardStore={ this.props.boardStore }
                                              id={ linkId }
                                            />
                                          </div>
                                        )}
                                      </Draggable>
                                    ))
                                }
                                { linkDroppableProvided.placeholder }
                              </div>
                            )}
                          </Droppable>
                          <Button
                            fullWidth
                            children='add new link'
                            onClick={
                              () => this.props.boardStore.newLink(listId)
                            }
                          />
                        </div>
                      </List>
                    </div>

                  ))
              }
            </Container>
          </DragDropContext>
        </Fragment>
      </Page>
    )
  }

  componentDidMount () {
    this.props.boardStore.refresh()
  }

}

export default () =>
  <Subscribe to={[ BoardStore ]}>
    {(boardStore) => (
      <Board { ...{ boardStore }} />
    )}
  </Subscribe>