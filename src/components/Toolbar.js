import styled from 'styled-components'
import { Subscribe } from 'unstated'
import {
  User as UserStore,
  Board as BoardStore,
} from '~/stores'
import { Fragment } from 'react'
import { Button } from '~/components'

const Container = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  background-color: #7b74e3;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`

export default () =>
  <Container>
    <Subscribe to={[ UserStore, BoardStore ]}>
      {({ state: { username }, logOut }, { newList }) => (
        <Fragment>
          <Button
            children='log out'
            onClick={ logOut }
          />
          <span
            children={ username }
          />
          <Button
            children='new list'
            onClick={ newList }
          />
        </Fragment>
      )}
    </Subscribe>
  </Container>