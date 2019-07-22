import React from 'react';
import './App.css';
import './common/stylus/index.styl';
import StyleText from './components/style-text/style-text'
import WorkText from './components/work-text/work-text'
import VFooter from './components/footer/footer'
import Promise from 'bluebird'
// import { writeMixin } from './common/js/mixin'
import { handleChar } from './common/js/util'
const styText = [0, 1, 2].map((i) => {
  return require('./components/style-text/styles' + i + '.css')
})

const endOfSentence = /[？！。~：]$/
const comma = /\D[，；、]$/
const endOfBlock = /[^/]\n\n$/

const debug = process.env.NODE_ENV !== 'production'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      speed: debug ? 0 : 16
    }
    this.paused = false // 暂停
    this.animationSkipped = false // 跳过 
  }
  

  componentDidMount() {
    this.done = false
    this.surprisinglyShortAttentionSpan()
  }

  write = async (index) => {
    // await this.writeTo(this.$el, styleText[index], 0, this.speed, true, 1)
  }

  writeTo = async (el, message, index, interval, mirrorToStyle, charsPerInterval) => {
    if (this.animationSkipped) {
      throw new Error('SKIP IT')
    }
    let chars = message.slice(index, index + charsPerInterval)
    // console.log(chars, index)
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
      // console.log(thisInterval)
      do {
        await Promise.delay(thisInterval + 100)
      } while (this.$root.paused)

      return this.writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval)
    }
  }

  startAnimation = async () => {
    try {
      // await this.$refs.styleText.write(0)
      // await this.$refs.workText.write()
      // await this.$refs.styleText.write(1)
      // this.$refs.workText.showWorkBox()
      // await Promise.delay(2000)
      // await this.$refs.styleText.write(2)
      // this.$refs.footer.end()
    } catch (e) {
      if (e.message === 'SKIP IT') {
        this.surprisinglyShortAttentionSpan()
      } else {
        throw e
      }
    }
  };
  surprisinglyShortAttentionSpan() {
    this.refs.styleText.writeToEnd()
    this.refs.workText.showWorkBox()
    this.refs.footer.end()
  }

  render() {
    return (
      <div className="App">
        <StyleText ref='styleText'></StyleText>
        <WorkText ref='workText'></WorkText>
        <VFooter ref='footer'></VFooter>
      </div>
    );  
  } 
}

export default App;
