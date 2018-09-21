import styled from 'styled-components'
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

export default ({ id, boardStore }) => {

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