import { PureComponent } from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import { Subscribe } from 'unstated'
import { Board as BoardStore } from '~/stores'
import { EditableDisplay } from '~/components'

const Container = styled.div`
  background-color: ${(props) => props.isDragging
    ? 'rgb(137, 150, 218)'
    : '#8a88e0' };
  border-radius: 3px;
`

const Link = (props) => (
  <Draggable
    draggableId={props.id}
    index={props.index}
  >
    {(provided, snapshot) => (
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        innerRef={provided.innerRef}
        isDragging={snapshot.isDragging}
      >
        <EditableDisplay
          id={ props.id }
          boardStore={ props.boardStore }
        />
      </Container>
    )}
  </Draggable>
)

export default (props) =>
  <Subscribe to={[ BoardStore ]}>
    {(boardStore) => (
      <Link
        { ...{ boardStore }}
        { ...props }
      />
    )}
  </Subscribe>