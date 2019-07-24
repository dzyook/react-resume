import React from "react";
import { handleChar } from '../../common/js/util'
import { HighterComponet } from '../mixin'
const styText = [0, 1, 2].map((i) => {
  return require('!!raw-loader!./styles' + i + '.css')
})

@HighterComponet 
class styleText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.text || '',
    }
    this.speed = this.props.speed || 0
    this.write = this.write.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.text) {
      this.setState({
        text: nextProps.text
      })
    }
  }

  async write (index) {
    await this.props.writeTo(this.styt, styText[index].default, 0, this.speed, true, 1)
  }
  writeToEnd = () => {
    // console.log(styText)
    const arr = styText.map(i => i.default)
    let txt = arr.join('\n')
    let styleHTML = ''
    for (let i = 0; i < txt.length; i++) {
      styleHTML = handleChar(styleHTML, txt[i])
    }
    this.setState({
      text: styleHTML
    })
    this.props.styleOverwrite('#work-text * {transition: none; }' + txt)
  }
  render() {
    const { text } = this.state;
    return (
      <pre id="style-text" ref={styt => this.styt = styt} contentEditable dangerouslySetInnerHTML={{__html: text}}>
      </pre>
    )
  }
}

export default styleText;