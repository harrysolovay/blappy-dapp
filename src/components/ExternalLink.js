import styled from 'styled-components'

const Anchor = styled.a`
  text-decoration: none;
`

export default (props) =>
  <div>
    <Anchor
      target='_blank'
      rel='noopener noreferrer'
      { ...props }
    />
  </div>