/**
 * @description Component as Home page
 * @author      Jiners Enoheart
 * @published   June 09, 2023
 * @modified    June 09, 2023
 */

import React from "react"
import { now } from "../../../resource/time"
import "./style.css"

class Clock extends React.Component {
  constructor() {
    super()
    this.state = {
      time: [now("d H"), now("M"), now("N D, Y")],
      timerID: setInterval(() =>
        this.setState({ time: [now("d H"), now("M"), now("N D, Y")] }), 30000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerID)
  }

  render = () => <div className="clock">
    <div>
      {this.state.time[0]}
      <span className="symbol">:</span>
      {this.state.time[1]}
    </div>
    <div>{this.state.time[2]}</div>
  </div>
}

export default Clock