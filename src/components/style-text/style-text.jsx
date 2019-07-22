import React, { useState } from "react";
// import { writeMixin } from 'common/js/mixin'
import { handleChar } from '../../common/js/util'
import sty1 from './styles0.css'
const styText = [0, 1, 2].map((i) => {
  return require('./styles' + i + '.css')
})


class styleText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }
  }
  write = async (index) => {
    await this.writeTo(this.$el, styText[index], 0, this.speed, true, 1)
  }
  writeToEnd = () => {
    console.log(styText, sty1)
    let txt = styText.join('\n')
    console.log(txt)
    let styleHTML = ''
    for (let i = 0; i < txt.length; i++) {
      styleHTML = handleChar(styleHTML, txt[i])
      console.log(styleHTML, txt[i])
    }
    this.text = styleHTML
    // this.$root.$emit('styleOverwrite', '#work-text * {transition: none; }' + txt)
  }
  render() {
    const { text } = this.state;
    return (
      <pre id="style-text" contentEditable dangerouslySetInnerHTML={{__html: text}}>
      </pre>
    )
  }
}

export default styleText;