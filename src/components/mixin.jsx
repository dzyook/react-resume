import React from "react";
import Promise from 'bluebird'
import { handleChar } from '../common/js/util'

const endOfSentence = /[？！。~：]$/
const comma = /\D[，；、]$/
const endOfBlock = /[^/]\n\n$/

const debug = process.env.NODE_ENV !== 'production'

export const HighterComponet = (ComposedComponent) => class extends React.Component {
  constructor(props) {
    super(props)
    this.text = ''
    this.work = ''
    this.speed  = debug ? 0 : 16
    this.writeTo = this.writeTo.bind(this)
  }
  componentDidMount() {
    this.styleBuffer = ''
  }

  async writeTo (el, message, index, interval, mirrorToStyle, charsPerInterval) {
    if (global.constants.animationSkipped) {
      throw new Error('SKIP IT')
    }
    let chars = message.slice(index, index + charsPerInterval)
    index += charsPerInterval

    el.scrollTop = el.scrollHeight

    if (mirrorToStyle) {
      this.writeChar(chars)
    } else {
      this.writeSimpleChar(chars)
    }

    if (index < message.length) {
      let thisInterval = interval
      let thisSlice = message.slice(index - 2, index)
      if (comma.test(thisSlice)) {
        thisInterval = interval * 30
      }
      if (endOfSentence.test(thisSlice)) {
        thisInterval = interval * 70
      }
      thisSlice = message.slice(index - 2, index + 1)
      if (endOfBlock.test(thisSlice)) {
        thisInterval = interval * 50
      }
      do {
        await Promise.delay(thisInterval + 0)
      } while (global.constants.paused)

      return this.writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval)
    }
  }

  async writeChar (char)  {
    this.text = handleChar(this.text, char)
    this.styleBuffer += char
    this.props.styleAppend(false, this.text)
    if (char === ';') {
      await this.props.styleAppend(this.styleBuffer) 
      this.styleBuffer = ''
    }
  }

  writeSimpleChar = (char) => {
    this.work += char
    this.props.workAppend(this.work)
  }

  render() {
    const props = {
      ...this.props,
    };
    props.ref = (el)=>
      this.props.getInstance && this.props.getInstance(el)
      return <ComposedComponent writeTo={this.writeTo} {...props} speed={this.speed} />;
  }
};


