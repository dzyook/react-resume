import React, { useState } from "react";
import Promise from 'bluebird'
import woText from './work.txt'
import Markdown from 'markdown'
import wheel from 'mouse-wheel'

const toHTML = Markdown.markdown.toHTML

class workText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      flipped: false,
      preview: true,
      show: false,
      workText: woText,
      mdText: toHTML(woText)
    }
  }

  getClass = () => {
    return this.state.flipped ? 'flipped' : ''
  }

  write = async () => {
    this.show = true
    await this.writeTo(this.$el, workText, 0, this.speed, false, 1)
  }

  showWorkBox() {
    const { flipped } = this.state;
    this.setState({
      show: true,
      preview: false,
      flipped: true
    },() => {
      this.$el.scrollTop = 9999
      let flipping = false
      wheel(this.$el, async function (dx, dy) {
        if (flipping) {
          return
        }
        let half = (this.$el.scrollHeight - this.$el.clientHeight) / 2
        let pastHalf = flipped ? this.$el.scrollTop < half : this.$el.scrollTop > half

        if (pastHalf) {
          this.setState({
            flipped: !flipped
          })
          flipping = true
          await Promise.delay(500)
          this.$el.scrollTop = flipped ? 9999 : 0
          flipping = false
        }
        this.$el.scrollTop += (dy * (flipped ? -1 : 1))
      }.bind(this), true)
    })
  }

  render() {
    const { show, text, workText, mdText, preview } = this.state;
    return (
      <pre id="work-text" className={this.getClass()} style={{visibility: !show}}>
        {
          preview ? <div dangerouslySetInnerHTML={{__html: text}}></div> :
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