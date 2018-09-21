import styled from 'styled-components'

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
export default (props) =>
  <StyledList>
    <div { ...props } />
  </StyledList>