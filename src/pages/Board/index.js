import styled from 'styled-components'
import { Component, Fragment } from 'react'
import { Subscribe } from 'unstated'
import { Board as BoardStore } from '~/stores'
import {
  Page,
  Toolbar,
  ExternalLink,
  Button,
} from '~/components'
import {
  IoIosMove,
  IoIosBrush,
  IoIosCheckmark,
  IoIosTrash,
} from 'react-icons/io'

const Container = styled.div`
  margin-top: 64px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 600px) {
    flex-direction: row;
  }
`

const StyledList = styled.div`
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
const List = (props) =>
  <StyledList>
    <div { ...props } />
  </StyledList>

const EditableDisplayContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px ${(props) => !props.isAlink && '0px' };
  ${(props) => props.isALink && `
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px;
    border-radius: 3px;
    background-color: #8a88e0;
  `}
  > div {
    display: flex;
    flex: 1;
    padding: 0px 10px;
  }
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: transparent;
    padding: 0px 5px;
  }
  input {
    display: inline;
    flex-shrink: 1;
    min-width: 0px;
    background-color: transparent;
    border-width: 0px;
    ::placeholder {
      color: #000;
      opacity: .25;
    }
  }
`

const EditableDisplay = ({ id, boardStore }) => {

  const value = boardStore.get(id)
  let newValue = value
  const isALink = Object.keys(boardStore.state.links).includes(id)
  const editing = boardStore.getEditingStatus(id)

  return <EditableDisplayContainer { ...{ isALink }}>
    <IoIosMove />
    <div>
      {
        editing
          ? <input
            autoFocus
            type='text'
            placeholder={ isALink ? 'my list' : 'mylink.io' }
            defaultValue={ value }
            onChange={({ target: { value } }) => newValue = value}
          />
          : isALink
            ? <ExternalLink
              href={ value }
              children={ value }
            />
            : <p children={ value } />
      }
    </div>
    {
      editing
        ? <Fragment>
          <Button onClick={() => boardStore.set(id, newValue)}>
            <IoIosCheckmark size={ 32 } />
          </Button>
          <Button onClick={() => boardStore.delete(id)}>
            <IoIosTrash />
          </Button>
        </Fragment>
        : <Button onClick={() => boardStore.setEditingStatus(id, true)}>
          <IoIosBrush />
        </Button>
        
    }
  </EditableDisplayContainer>
}


class Board extends Component {

  render () {
    return this.props.boardStore.loading
      ? <div>loading</div>
      : <Page>
        <Fragment>
          <Toolbar />
          <Container>
            {
              Object.keys(this.props.boardStore.state.lists).length >= 1 &&
                Object.values(this.props.boardStore.state.lists).map((list) => {
                  const listId = list.id
                  return (
                    <List key={ listId }>
                      <EditableDisplay
                        boardStore={ this.props.boardStore }
                        id={ listId }
                      />
                      <div>
                        {
                          Object.values(list.links).map(((linkId) => (
                            <EditableDisplay
                              key={ linkId }
                              boardStore={ this.props.boardStore }
                              id={ linkId }
                            />
                          )))
                        }
                        <Button
                          fullWidth
                          children='add new link'
                          onClick={
                            () => this.props.boardStore.newLink(listId)
                          }
                        />
                      </div>
                    </List>
                  )
                })
            }
          </Container>
        </Fragment>
      </Page>
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