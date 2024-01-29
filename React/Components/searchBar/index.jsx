import React, { useRef } from "react"
import "./style.css"

export default (props) => {
  const input = useRef(null)

  return <div className="search-bar">
    <input type="text" ref={input}
      onChange={(evt) => props.setSearch ? props.setSearch(evt.target.value) : false}
      onKeyDown={(evt) => evt.keyCode === 13 && props.doing ? props.doing() : false}
      placeholder={props.placeholder ? props.placeholder : ""} />
    <i className="icon-search-1"
      onClick={() => props.doing ? props.doing() : false} />
  </div>
}