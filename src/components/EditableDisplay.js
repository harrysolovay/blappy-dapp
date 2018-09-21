import styled from 'styled-components'
import { Component } from 'react'
import {
  Button,
  ExternalLink,
} from '~/components'
import {
  IoIosMove,
  IoIosBrush,
  IoIosCheckmark,
  IoIosTrash,
} from 'react-icons/io'
import { Fragment } from 'react'

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

export default class EditableDisplay extends Component {

  state = {
    value: this.props.boardStore.get(this.props.id),
  }

  render () {

    const defaultValue = this.props.boardStore.get(this.props.id)
    const isALink = Object.keys(this.props.boardStore.state.links).includes(this.props.id)
    const editing = this.props.boardStore.getEditingStatus(this.props.id)

    return (
      <EditableDisplayContainer { ...{ isALink }}>
        <div>
          {
            editing
              ? <input
                autoFocus
                type='text'
                placeholder={ isALink ? 'mylink.io' : 'my list' }
                { ...{ defaultValue }}
                onChange={({ target: { value } }) => {
                  if (!value) value = ''
                  this.setState({ value })
                }}
              />
              : isALink
                ? <ExternalLink
                  href={ this.state.value }
                  children={ this.state.value }
                />
                : <p children={ this.state.value } />
          }
        </div>
        {
          editing
            ? <Fragment>
              <Button onClick={() => this.props.boardStore.set(this.props.id, this.state.value)}>
                <IoIosCheckmark size={ 32 } />
              </Button>
              <Button onClick={() => this.props.boardStore.delete(this.props.id)}>
                <IoIosTrash />
              </Button>
            </Fragment>
            : <Button onClick={() => this.props.boardStore.setEditingStatus(this.props.id, true)}>
              <IoIosBrush />
            </Button>
            
        }
      </EditableDisplayContainer>
    )
  }
}