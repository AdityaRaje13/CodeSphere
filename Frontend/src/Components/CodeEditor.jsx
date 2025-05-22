import React from 'react'
import Editor from '@monaco-editor/react';

function CodeEditor() {

    function handleEditorValidation(markers) {
        // model markers
        markers.forEach((marker) => console.log('onValidate:', marker.message));
      }

      return (
        <>
        
        <Editor
          height="50vh"
          defaultLanguage="javascript"
          defaultValue="// let's write some broken code 😈"
          onValidate={handleEditorValidation}
        />
        
        </>
      );
}

export default CodeEditor