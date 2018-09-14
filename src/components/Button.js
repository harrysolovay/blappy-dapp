import styled from 'styled-components'

export default styled.button`
  ${(props) => props.fullWidth && `
    display: block;
    width: 100%;
  `}
  background-color: ${ (props) => props.backgroundColor };
  padding: 10px 20px 11px 20px;
  ${(props) => props.markerized ? `
    font-family: 'Permanent Marker', cursive;
    font-size: 18px;
    letter-spacing: .25em;
    &:first-child {
      margin-right: 10px;
    }
  ` : `
    padding: 7px 10px;
    font-size: 16px;
    line-height: 24px;
    background-color: #8a88e0;
  `}
  color: #000;
  * {
    color: #000;
  }
  ${(props) => props.color && `
    color: ${ props.color };
    * {
      color: ${ props.color };
    }
  `}
`