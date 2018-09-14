import { injectGlobal } from 'styled-components'
import normalize from 'styled-normalize'

export default () =>
  injectGlobal`

    ${ normalize }

    * {
      margin: 0px;
      padding: 0px;
      border-width: 0px;
      box-sizing: border-box;
      
      &:focus {
        outline: none;
      }
    }

    body {
      font-family: 'Questrial', sans-serif;
      font-size: 18px;
      line-height: 27px;
      background-color: #6c5ce7;
    }

    h1 {
      font-family: 'Bangers', cursive;
      font-size: 3em;
      line-height: 1em;
      letter-spacing: .0625em;
    }

    .marker {
      font-family: 'Permanent Marker', cursive;
    }

    button {
      appearance: none;
      border: 0px;
      border-radius: 3px;
      cursor: pointer;
      &:hover {
        opacity: .875;
      }
    }

  `