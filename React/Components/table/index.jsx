/**
 * @description Table component
 * @author      Jiners Enoheart
 * @published   June 02, 2023
 * @modified    June 16, 2023
 */

import React, { useState } from "react"
import "./style.css"

export default (props) => {
  let nothing = <div>&nbsp;</div>
  if (!props || !props.Field || !Array.isArray(props.Field))
    return nothing

  const [PageNo, setPageNo] = useState(props.PageNo)

  return <table className="itct">
    <thead>
      <tr key="Head-0">
        <td align="center">
          <i className="icon-plus-circle" onClick={
            props.Method && props.Method.Add ? props.Method.Add : null} />
        </td>
        <td>&nbsp;No</td>
        {props.Field.map((item, index) => {
            return <td key={`Head-0-${index}`}>
              {item.Name}
              {item.Order && props.Order ?
                item.Key ?
                  Array.isArray(item.Key) ?
                    !props.Order[item.Key[0]] || props.Order[item.Key[0]] === 'ASC' ?
                      < i className="icon-down-dir" onClick={() =>
                        props.Method && props.Method.SetOrder ?
                          props.Method.SetOrder(item.Key[0], 'DESC') : false} /> :
                      < i className="icon-up-dir" onClick={() =>
                        props.Method && props.Method.SetOrder ?
                          props.Method.SetOrder(item.Key[0], 'ASC') : false} /> :
                    !props.Order[item.Key] || props.Order[item.Key] === 'ASC' ?
                      < i className="icon-down-dir" onClick={() =>
                        props.Method && props.Method.SetOrder ?
                          props.Method.SetOrder(item.Key, 'DESC') : false} /> :
                      < i className="icon-up-dir" onClick={() =>
                        props.Method && props.Method.SetOrder ?
                          props.Method.SetOrder(item.Key, 'ASC') : false} /> :
                  !props.Order[item.Name] || props.Order[item.Name] === 'ASC' ?
                    < i className="icon-down-dir" onClick={() =>
                      props.Method && props.Method.SetOrder ?
                        props.Method.SetOrder(item.Name, 'DESC') : false} /> :
                    < i className="icon-up-dir" onClick={() =>
                      props.Method && props.Method.SetOrder ?
                        props.Method.SetOrder(item.Name, 'ASC') : false} /> :
                ""}
            </td>
          })}
        <td align="center">
          <i className="icon-plus-circle" onClick={
            props.Method && props.Method.Add ? props.Method.Add : null} />
        </td>
      </tr>
      <tr key="Head-1">
        <td><i className="icon-search" onClick={() =>
          props.Method.Refresh ? (props.Method.Refresh(1), setPageNo(1)) : false} /></td>
        <td></td>
        {props.Field.map((item, index) => item.Searchable ?
            <td key={`Head-1-${index}`}>
              {item.Type === "select" ?
                <select onChange={(evt) => props.Method && props.Method.SetSearch ?
                  props.Method.SetSearch(item.Key ? Array.isArray(item.Key) ? item.Key[0] : item.Key : item.Name,
                    evt.target.value) : false}>
                  {item && item.Array.length > 0  
                    ? item.Array.map((i, n) =>
                      <option value={i.ID} key={`Head-1-${index}-select-${n}`}>
                        {i.Name}
                      </option>)
                    : '' }
                </select> :
                <input type="text" onChange={(evt) => props.Method.SetSearch ?
                  props.Method.SetSearch(item.Key ? Array.isArray(item.Key) ? item.Key[0] : item.Key : item.Name,
                    evt.target.value) : false} />}
            </td> :
            <td key={`Head-1-${index}`}></td>)}
        <td><i className="icon-search" onClick={() =>
          props.Method.Refresh ? (props.Method.Refresh(1), setPageNo(1)) : false} /></td>
      </tr>
    </thead>

    <tbody>
      {props.Data && Array.isArray(props.Data) && props.Data.length > 0 ?
        props.Data.map((item, index) => <tr key={`Body-${index}`} className="value">
          <td>{props.Method.Edit ?
            <i className="icon-eye-2" onClick={() => props.Method.Edit(index, item.ID)} /> : <></>}
          </td>
          <td align="center">
            {(props.PageNo - 1) * props.CountPerPage + index + 1}</td>
          {props.Field.map((field, n) =>
              <td key={`Body-${index}-${n}`} align={field.Align ? field.align : "center"}>
                {field.Render ?
                  field.Render(Array.isArray(field.Key) ?
                    field.Key.map(id => item[id]) :
                    field.Key ?
                      item[field.Key] :
                      item[field.Name]) :
                  field.Key ?
                    item[field.Key] :
                    item[field.Name]}
              </td>)}
          <td>{props.Method.Delete ?
            <i className="icon-cancel-circled-2" onClick={() => props.Method.Delete(index, item.ID)} /> :
            props.Method.Edit ?
              <i className="icon-eye-2" onClick={() => props.Method.Edit(index, item.ID)} /> : ""}</td>
        </tr>) :
        <tr key="Body-0">
          <td colSpan={props.Field.length + 3} align="center" className="none">None</td>
        </tr>}
      {props.StatusEl ?
        <tr className="status"><td colSpan={props.Field.length + 3} className="status">
          {props.StatusEl ? props.StatusEl : " "}
        </td></tr> :
        <tr></tr>}
      <tr key="Pagenation" className="pagenation">
        <td align="center">
          <i className="icon-plus-circle" onClick={
            props.Method && props.Method.Add ? props.Method.Add : null} />
        </td>
        <td colSpan={props.Field.length + 1} align="center">
          <i className="icon-fast-backward" onClick={() =>
            PageNo > 1 ? (setPageNo(1), props.Method.Refresh(1)) : false} />
          <i className="icon-left-dir"
            onClick={() => PageNo > 1 ? (setPageNo(PageNo - 1), props.Method.Refresh(PageNo - 1)) : false} />
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
            }}
          />
          &nbsp;/&nbsp;
          {props.PageCount ? props.PageCount : 0}
          <i className="icon-right-dir" onClick={() =>
            PageNo < props.PageCount ? (setPageNo(PageNo + 1), props.Method.Refresh(PageNo + 1)) : false} />
          <i className="icon-fast-forward" onClick={() =>
            PageNo < props.PageCount ? (setPageNo(props.PageCount), props.Method.Refresh(props.PageCount)) : false} />
        </td>
        <td align="center">
          <i className="icon-plus-circle" onClick={
            props.Method && props.Method.Add ? props.Method.Add : null} />
        </td>
      </tr>
    </tbody>
  </table>
}