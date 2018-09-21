import { Component } from 'react'
import styled from 'styled-components'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import List from './List'
import { Subscribe } from 'unstated'
import { Board as BoardStore } from '~/stores'
import { Page, Toolbar } from '~/components'

const Container = styled.div`
  margin-top: 64px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 600px) {
    flex-direction: row;
  }
`

class NewBoard extends Component {

  state = { screenWidth: document.body.clientWidth }

  render () {
    return (
      <DragDropContext onDragEnd={ this.props.boardStore.onDragEnd }>
        <Droppable
          droppableId='all-lists'
          direction={
            this.state.screenWidth >= 600
              ? 'horizontal'
              : 'vertical'
          }
          type='list'
        >
          {(provided) => (
            <Container
              {...provided.droppableProps}
              innerRef={provided.innerRef}
            >
              {
                this.props.boardStore.state.listOrder.map((listId, index) => (
                  <List
                    key={ listId }
                    index={ index }
                    id={ listId }
                  />
                ))
              }
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  componentDidMount () {
    window.addEventListener('resize', (e) => {
      this.setState({
        screenWidth: document.body.clientWidth,
      })
    })
  }

  componentDidMount () {
    this.props.boardStore.refresh()
  }
}

export default () =>
  <Page>
    <Toolbar />
    <Subscribe to={[ BoardStore ]}>
      {(boardStore) => (
        <NewBoard { ...{ boardStore }} />
      )}
    </Subscribe>
  </Page>