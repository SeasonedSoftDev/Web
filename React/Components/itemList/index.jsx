/**
 * @description Item-list component
 * @author      Jiners Enoheart
 * @published   Jul 07, 2023
 * @modified    Jul 16, 2023
 */

import React, { useState, useEffect } from "react"
import "./style.css"

export default (props) => {
  let nothing = <div className="nothing">Nothing yet</div>
  if (!props.Data || props.Data <= 0)
    return nothing

  const [PageNo, setPageNo] = useState(props.PageNo)
  if (props.PageCount < PageNo) setPageNo(1)

  useEffect((PageNo) => {
    if(props.PageNo !== PageNo) setPageNo(props.PageNo)
  }, [props.PageNo])

  return <div className="item-list">
    <div className="list">
      {props.Data.map((item, index) =>
        props.Method.Render ? props.Method.Render(item, index) : "...")}
    </div>
    {props.StatusEl ? props.StatusEl : " "}
    <div className="pagenation">
      <i className="icon-fast-backward" onClick={() =>
        PageNo > 1 ? (setPageNo(1), props.Method.Refresh(1)) : false} />
      <i className="icon-left-dir" onClick=
        {() => PageNo > 1 ? (setPageNo(PageNo - 1), props.Method.Refresh(PageNo - 1)) : false} />
      <input value={PageNo} className="PageInput"
        onChange={(evt) => setPageNo(evt.target.value)}
        onKeyPress={(evt) => evt.key >= '0' && evt.key <= '9' ? true : evt.preventDefault()}
        onKeyDown={(evt) => {
          if (evt.keyCode === 13) {
            let pn = evt.target.value < 1 ? 1 :
              evt.target.value > props.PageCount ?
                props.PageCount :
                evt.target.value
            setPageNo(pn)
            if (props.Method.Refresh) props.Method.Refresh(pn)
          }
        }} />
      &nbsp;/&nbsp;
      {props.PageCount ? props.PageCount : 0}
      <i className="icon-right-dir" onClick={() =>
        PageNo < props.PageCount ?
          (setPageNo(PageNo + 1), props.Method.Refresh(parseInt(PageNo) + 1)) :
          false} />
      <i className="icon-fast-forward"
        onClick={() =>
          PageNo < props.PageCount ?
            (setPageNo(props.PageCount), props.Method.Refresh(props.PageCount)) :
            false} />
    </div>
  </div>
}