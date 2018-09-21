import { Component } from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Link from './Link'
import {
  EditableDisplay,
  Button,
} from '~/components'
import { Subscribe } from 'unstated'
import { Board as BoardStore } from '~/stores'

const Container = styled.div`
  padding: 10px;
  > div {
    padding: 0px 10px 10px 10px;
    border-radius: 3px;
    background-color: #7b74e3;
    @media screen and (min-width: 600px) and (max-width: 1000px) {
      width: 60vw;
    }
    @media screen and (min-width: 1001px) {
      width: 45vw;
    }
  }
`

const LinkContainer = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => props.isDraggingOver
    ? 'rgba(255, 255, 255, .25)'
    : 'transparent' };
  flex-grow: 1;
  min-height: 100px;
`

const List = ({ index, id, boardStore }) => {
  console.log(id, boardStore)
  return (
    <Draggable
      draggableId={id}
      index={index}
    >
      {(provided) => (
        <Container
          {...provided.draggableProps}
          innerRef={provided.innerRef}
        >
          <div>
            <div {...provided.dragHandleProps}>
              <EditableDisplay
                id={ id }
                boardStore={ boardStore }
              />
            </div>
            <Droppable
              droppableId={ id }
              type='link'
            >
              {(provided, snapshot) => (
                <LinkContainer
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {
                    boardStore.state.lists[id].linkIds.length >= 1 &&
                      boardStore.state.lists[id].linkIds.map((id, index) => (
                        <Link
                          key={ id }
                          { ...{ id, index }}
                        />
                      ))
                  }
                  {provided.placeholder}
                  <Button
                    fullWidth
                    children='add new link'
                    onClick={() => boardStore.newLink(id)}
                  />
                </LinkContainer>
              )}
            </Droppable>
          </div>
        </Container>
      )}
    </Draggable>
  )
}

export default (props) =>
  <Subscribe to={[ BoardStore ]}>
    {(boardStore) => (
      <List
        { ...{ boardStore }}
        { ...props }
      />
    )}
  </Subscribe>