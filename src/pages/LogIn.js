import styled from 'styled-components'
import { Page, Button, ExternalLink } from '~/components'
import { Subscribe } from 'unstated'
import { User as UserStore } from '~/stores'

const Container = styled.div`
  position: fixed;
  top: 0px; right: 0px; bottom: 0px; left: 0px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`

const ButtonContainer = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const Banner = styled.div`
  background-color: rgba(255, 255, 255, .125);
  width: 100%;
  > a {
    color: #000;
    display: block;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    line-height: 24px;
  }
`

const Center = styled.div`
  padding: 0px 20px;
`

const Heading = styled.h1`
  margin: 0px;
`

const Subheading = styled.div`
  margin-top: 20px;
  * {
    display: inline;
    font-size: 1.125em;
  }
  p { color: #000; }
  b { color: #fff; }
`

export default () =>
  <Page>
    <Container>
      <Banner>
        <a
          href='#'
          children='learn to build this dapp from scratch'
        />
      </Banner>
      <Center>
        <Heading children='welcome to Blappy' />
        <Subheading>
          <p children='a ' />
          <b children='B' />
          <p children='lockstack-based ' />
          <b children='l' />
          <p children='ink d' />
          <b children='app' />
          <p children=' that will make you happ' />
          <b children='y' />
        </Subheading>
        <ButtonContainer>
          <Button
            markerized
            backgroundColor='#2b303e'
            color='#fff'
          >
            <ExternalLink
              href='https://github.com/harrysolovay/blappy-dapp'
              children='source code'
            />
          </Button>
          <Subscribe to={[ UserStore ]}>
            {
              (user) => (
                <Button
                  markerized
                  children='log in'
                  onClick={ user.logIn }
                  backgroundColor='#5a8dee'
                  color='#fff'
                />
              )
            }
          </Subscribe>
        </ButtonContainer>
      </Center>
      <Banner>
        <a
          href='https://blockstack.org/'
          children={
            `copyright © ${ new Date().getFullYear() }, Blockstack`
          }
        />
      </Banner>
    </Container>
  </Page>