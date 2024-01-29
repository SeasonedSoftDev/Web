/**
 * @description Image Input Component
 * @published Jan 31, 2023
 * @modified Jun 16, 2023
 * @author Davies Martines & Jiners Enoheart
 */

import React, { useRef } from "react"
import "./style.css"

export default (props) => {
  const reader = new FileReader() //Processor loading image
  const image = useRef()
  const file = useRef()

  /**
   * @description function to apply buffer of image file
   * @param {object} event
   */
  reader.onload = (event) => {
    image.current.src = event.target.result
    if (props.buffer) props.buffer(event.target.result)
  }

  /**
   * Action processor when click on component
   */
  const handleInputFile = () => file.current.click()

  /**
   * Processor when change its image
   */
  const handleChangeFile = () => {
    if (file.current.files[0]) {
      reader.readAsDataURL(file.current.files[0])
      if (props.onChange) props.onChange(file.current.files[0])
    }
  }

  return (
    <div className="image-input" >
      <img src={props.src?props.src:props.default ? props.default : ""}
        alt="..." ref={image} onClick={handleInputFile} />
      <input id="file" type="file" accept="image/*" ref={file}
        onChange={handleChangeFile} />
    </div>
  );
};
