import React from 'react'
import styled from 'styled-components'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const EditorWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  background: #fff;
  .demo-editor.rdw-editor-main {
    height: calc(100% - 50px);
  }
  .rdw-editor-wrapper {
    height: 100%;
  }
  .rdw-editor-main {
    height: auto;
  }
`

function TextEditor({ editorState, onEditorStateChange, ...props }) {
  return (
    <EditorWrapper>
      <Editor editorState={editorState} onEditorStateChange={onEditorStateChange} {...props} />
    </EditorWrapper>
  )
}

export default TextEditor
