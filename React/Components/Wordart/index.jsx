/**
 * REACT WORDART EDITOR
 * @author Victor Philamon & Jiners Enoheart
 * @published Feb 01, 2023
 * @modified  Jul 06, 2023
 */

import React from "react"
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./style.css"

/**
 * Method to load file into 
 * @param {string} path
 * @returns Promise to read file
 */
export default (props) => {
  if (!props.Contents) return <></>

  const onEditorStateChange = state => props.setContents ? props.setContents(state) : false

  return <Editor
    editorState={props.Contents}
    onEditorStateChange={props.readOnly ? null : onEditorStateChange}
    toolbar={{
      image: {
        defaultSize: { height: "auto", width: "300" },
      },
      inputAccept:
        `application/pdf,text/plain,
        application/vnd.openxmlformatsofficedocument.wordprocessingml.document,
        application/msword,application/vnd.ms-excel`,
    }} />
}