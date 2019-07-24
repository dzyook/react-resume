import React from "react";
import Promise from 'bluebird'
import woText from './work.txt'
import { HighterComponet } from '../mixin'
import Markdown from 'markdown'
import wheel from 'mouse-wheel'

const toHTML = Markdown.markdown.toHTML

@HighterComponet
class workText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      preview: true,
      show: false,
      workText: woText,
      mdText: toHTML(woText),
      flipped: false,
      work: this.props.work || '',
    }
    this.write = this.write.bind(this)
    this.showWorkBox = this.showWorkBox.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.work && nextProps.work !== this.props.work) {
      this.setState({
        work: nextProps.work
      })
    }
  }

  async write () {
    this.setState({ show: true })
    await this.props.writeTo(this.workref, this.state.workText, 0, this.speed, false, 1)
  }

  async showWorkBox () {
    this.setState({
      show: true,
      preview: false,
      flipped: true
    },() => {
      this.workref.scrollTop = 9999 
      let flipping = false
      wheel(this.workref, async function (dx, dy) {
        if (flipping) {
          return
        }
        let half = (this.workref.scrollHeight - this.workref.clientHeight) / 2
        let pastHalf = this.state.flipped ? this.workref.scrollTop < half : this.workref.scrollTop > half
        if (pastHalf) {
          this.setState({ flipped: !this.state.flipped },async function (){
            flipping = true
            await Promise.delay(500)
            this.workref.scrollTop = this.state.flipped ? 9999 : 0
            flipping = false
          })
        }
        this.workref.scrollTop += (dy * (this.state.flipped ? -1 : 1))
        
      }.bind(this), true)
    })
  }

  render() {
    const { show, work, workText, mdText, preview, flipped } = this.state;
    return (
      <pre 
        id="work-text" 
        ref={workref => this.workref = workref}  
        className={flipped ? 'flipped' : ''} 
        style={{visibility: !show ? 'hidden' : 'visible'}}
      >
        {
          preview ? <div dangerouslySetInnerHTML={{__html: work}}></div> :
          <div>
            <div className="text" dangerouslySetInnerHTML={{__html: workText}}></div>
            <div className="md" dangerouslySetInnerHTML={{__html: mdText}}></div>
          </div>
        }
      </pre>
    )
  }
}

export default workText;