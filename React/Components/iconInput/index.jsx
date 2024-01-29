/**
 * @description Input text with ICON
 * @author      Jiners Enoheart
 * @published   June 02, 2023
 * @modified    June 02, 2023
 */

import React, { useRef, useEffect } from "react"
import "./style.css"

export default (props) => {
  const input = useRef(null)

  /**
   * Function to get all the valid chars from val: ex: 0->9a->9
   * ex: 0->9 => 0123456789
   * @param {string} valid
   */
  const calcValid = (valid) => {
    if (!valid) return
    let i = 0, j, k, before, after, direction = 1, temp

    while ((i = valid.indexOf("->")) > 0) {
      before = valid.substring(0, i)
      after = valid.substring(i + 2)
      j = valid.charAt(i - 1).charCodeAt(0)
      k = valid.charAt(i + 2).charCodeAt(0)
      direction = j < k ? 1 : -1
      temp = ""
      for (j = j + 1; j !== k; j += direction) temp += String.fromCharCode(j)
      valid = before + temp + after
    }
    return valid
  }
  let valid = calcValid(props.valid)

  // catch enter keyCode and handle login method recieved as props
  const keyDown = (event) =>
    event.keyCode === 13 && props.handler !== undefined ? props.handler() : false

  //Function to check input valid
  const keyPress = (evt) =>
    valid ? valid.indexOf(evt.key) >= 0 ? true : evt.preventDefault()
      : props.invalid ? props.invalid.indexOf(evt.key) >= 0 ? evt.preventDefault() : true
        : true

  useEffect(() => {
    if (props.bind) props.bind(input.current)
  })

  useEffect(() => {
    if (props.autoFocus && !props.readOnly) input.current.focus()
  }, [props.autoFocus, props.readOnly])

  return <div className={"icon-input" + (props.className ? ` ${props.className}` : "")}>
    <input
      type={props.type} maxLength={props.maxLength} defaultValue={props.defaultValue}
      value={props.value} onKeyDown={keyDown} onKeyPress={keyPress} disabled={props.disabled}
      placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)}
      readOnly={props.readOnly ? true : false}
      ref={input}
    />
    <i className={props.icon}></i>
    {props.tooltip ? <span>{props.message}</span> : ""}
  </div>
};
