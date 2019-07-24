import React from 'react';
import './App.css';
import './common/stylus/index.styl';
import StyleText from './components/style-text/style-text'
import WorkText from './components/work-text/work-text'
import VFooter from './components/footer/footer'
import Promise from 'bluebird'
import './common/config/config'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      work: '',
    }
    this.styleTagEl = document.getElementById('style-tag')
  }
 
  componentDidMount() {
    this.done = false
    this.startAnimation()
  }

  styleOverwrite = (styleText) => {
    this.styleTagEl.textContent = styleText
  }

  workAppend = (work) => {
    this.setState({
      work,
    })
  }

  togglePause = (state) => {
    global.constants.paused = state === 1
  }

  skip = () => {
    global.constants.animationSkipped = true
  }

  styleAppend = (styleText, text) => {
    if(styleText) this.styleTagEl.textContent += styleText
    this.setState({
      text,
    })
  }

  async startAnimation () {
    try {
      await this.childCp.write(0)
      await this.work.write()
      await this.childCp.write(1)
      this.work.showWorkBox()
      await Promise.delay(2000)
      await this.childCp.write(2)
      this.refs.footer.end()
    } catch (e) {
      if (e.message === 'SKIP IT') {
        this.surprisinglyShortAttentionSpan()
      } else {
        throw e
      }
    }
  };
  surprisinglyShortAttentionSpan() {
    this.childCp.writeToEnd()
    this.work.showWorkBox()
    this.refs.footer.end()
  }

  render() {
    return (
      <div className="App">
        <StyleText 
          styleOverwrite={this.styleOverwrite} 
          ref='styleText' 
          getInstance={(childCp) => { this.childCp = childCp }} 
          styleAppend={this.styleAppend}
          text={this.state.text}
        />
        <WorkText 
          getInstance={(childCp) => { this.work = childCp }} 
          ref='workText'
          work={this.state.work}
          workAppend={this.workAppend}
        />
        <VFooter 
          ref='footer' 
          togglePause={this.togglePause}
          skip={this.skip}
        />
      </div>
    );  
  } 
}

export default App;
