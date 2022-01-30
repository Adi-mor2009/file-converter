import React from "react";
import UploadFiles from './components/UploadFiles/UploadFiles';

function App() {
  return (
    <div className="container" style={{ width: "600px" }}>
      <div style={{ margin: "20px" }}>
        <h4>Upload XML Files Download MarcXml Files</h4>
      </div>
 
      <UploadFiles />
    </div>
  );
}

export default App;
