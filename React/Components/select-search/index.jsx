/**
 * @author Jiners Enoheart
 * @published Jun 27, 2023
 * @modified Jun 27, 2023
 * @description Component as select with function to search by text input
 */

import React, { useState, useRef, useEffect } from "react"
import "./style.css"

export default (props) => {
  let selectedItem = props.list && props.value ? props.list.find(item => item.value === props.value) : null
  const [search, setSearch] = useState(selectedItem ? selectedItem.Name : "")
  const [typing, setTyping] = useState(false)
  const [visibleList, setVisibleList] = useState(false)
  let input = useRef()

  useEffect(() => {
    if (props.bind) props.bind(input.current)
    if (!typing && !props.value) setSearch("")
  }, [props, typing, setSearch])

  return <div disabled={props.disabled ? true : false} className="select-search" >
    <div className="header">
      <div style={{ float: "left" }}>
        {!props.value ? <i className="icon-help-2" /> :
          selectedItem ?
            selectedItem.img ?
              <img src={selectedItem.img} alt="..." /> :
              <i className={selectedItem.icon} />
            : ""}
      </div>
      <div style={{ float: "right", width: "calc(100% - 1.5em)" }}>
        <input disabled={props.disabled ? true : false} value={search} ref={input}
          placeholder={props.placeholder ? props.placeholder : ""}
          onChange={(evt) => {
            setSearch(evt.target.value)
            setVisibleList(true)
          }}
          onFocus={() => {
            setTyping(true)
            setVisibleList(true)
          }}
          onClick={() => setVisibleList(true)}
          onBlur={(evt) => {
            setTyping(false)
            if (!evt.target.value && props.onChange) props.onChange()
          }} />
      </div>

      <div style={{ clear: "both" }}></div>
    </div>

    <div style={{ clear: "both" }}></div>

    <div className="list" style={{ visibility: visibleList ? props.disabled ? "hidden" : "visible" : "hidden" }}
      onMouseLeave={() => setVisibleList(false)}>
      <div className={`item`}
        onClick={(evt) => {
          if (props.onChange) props.onChange()
          setSearch("")
          setVisibleList(false)
        }}
      >
        { }&nbsp;{"..."}
      </div>
      {props.list && props.list.length > 0  
        ? props.list.filter(item => search ?
            item.Name.toLowerCase().indexOf(search.toLowerCase()) >= 0 :
            true)
            .map((item, index) => {
              let icon = item.img ? <img src={item.img} alt="..." /> : <i className={item.icon} />

              return <div className={`item ${item.class ? item.class : ""}`}
                onClick={(evt) => {
                  if (props.onChange) props.onChange(item.value)
                  setSearch(item.Name)
                  setVisibleList(false)
                }}
                key={`item-${index}`}>
                {icon}&nbsp;{item.Name}
              </div>
            }) 
        : ''
        }
    </div>
  </div>
}