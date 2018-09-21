import styled from 'styled-components'

const Anchor = styled.a`
  text-decoration: none;
`

export default (props) => {
  console.log(props)
  let { href } = props
  if (!href.includes('http')) {
    console.log('happened')
    href = `http://${href}`
  }
  return (
    <Anchor
      target='_blank'
      rel='noopener noreferrer'
      { ...props }
      { ...{ href }}
    />
  )
}