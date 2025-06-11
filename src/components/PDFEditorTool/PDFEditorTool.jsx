import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const PDFEditorTool = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [editedPdfBlob, setEditedPdfBlob] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleEditAndDownload = async () => {
    if (!file || !searchText || !replaceText) {
      alert("Please upload a PDF and fill both text fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("searchText", searchText);
    formData.append("replaceText", replaceText);

    try {
      const response = await fetch("http://localhost:8080/api/pdf/edit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("PDF editing failed");

      const blob = await response.blob();
      setEditedPdfBlob(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "edited.pdf";
      link.click();
    } catch (error) {
      console.error("Error editing PDF:", error);
    }
  };

  return (
    <div>
      <h2>PDF Editor</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {file && (
        <div style={{ border: "1px solid #ccc", marginTop: "20px" }}>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search Text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Replace With"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={handleEditAndDownload}>
          Replace & Download
        </button>
      </div>
    </div>
  );
};

export default PDFEditorTool;
