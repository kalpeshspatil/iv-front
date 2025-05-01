import React, { useState } from "react";
import * as XLSX from "xlsx";
import Select from "react-select";
import { evaluate } from "mathjs";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { API_BASE_URL } from "../../constants.js";
import { useEffect } from "react";


const getColumnLetter = (index) => String.fromCharCode(65 + index);

const ExcelReportImportExportTool = () => {
  const [rawData, setRawData] = useState([]);
  const [columnOptions, setColumnOptions] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [formulaMap, setFormulaMap] = useState({});
  const [formulas, setFormulas] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [formulaInput, setFormulaInput] = useState("");
  const [outputColumnName, setOutputColumnName] = useState("");
  const [pendingFormulas, setPendingFormulas] = useState(null);


  useEffect(() => {
    if (pendingFormulas && Object.keys(formulaMap).length > 0) {
      evaluateAllFormulas(pendingFormulas);
      setPendingFormulas(null); // reset
    }
  }, [formulaMap, pendingFormulas]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setRawData(jsonData);

      const columns = Object.keys(jsonData[0] || {}).map((col) => ({
        label: col,
        value: col,
      }));

      setColumnOptions(columns);
      setSelectedColumns([]);
      setFormulaMap({});
      setFormulas([]);
      setCalculatedData([]);
      loadTemplates();
    };

    reader.readAsBinaryString(file);
  };

  const handleColumnSelection = (selected) => {
    setSelectedColumns(selected);
    const newMap = {};
    selected.forEach((col, index) => {
      newMap[getColumnLetter(index)] = col.value;
    });
    setFormulaMap(newMap);
  };

  const addFormula = () => {
    if (!formulaInput || !outputColumnName) return;

    const testRow = rawData[0];
    const scope = {};
    Object.entries(formulaMap).forEach(([letter, colName]) => {
      scope[letter] = parseFloat(testRow[colName]) || 0;
    });

    try {
      evaluate(formulaInput, scope);
      const newFormulas = [
        ...formulas,
        { formula: formulaInput, outputName: outputColumnName },
      ];
      setFormulas(newFormulas);
      evaluateAllFormulas(newFormulas);
      setFormulaInput("");
      setOutputColumnName("");
    } catch (err) {
      alert("Invalid formula! Please check syntax and variable mappings.");
    }
  };

  const evaluateAllFormulas = (formulaList) => {
    const results = rawData.map((row) => {
      const scope = {};
      Object.entries(formulaMap).forEach(([letter, colName]) => {
        scope[letter] = parseFloat(row[colName]) || 0;
      });

      const newRow = { ...row };
      formulaList.forEach(({ formula, outputName }) => {
        try {
          let result = evaluate(formula, scope);
          if (typeof result === "object") {
            if (typeof result.valueOf === "function") {
              result = result.valueOf();
            }
            if (typeof result !== "string" && typeof result !== "number") {
              result = result.toString();
            }
          }
          newRow[outputName] = result;
        } catch (err) {
          newRow[outputName] = "ERR";
        }
      });

      return newRow;
    });

    setCalculatedData(results);
  };

  const exportToExcel = () => {
    const selectedColNames = selectedColumns.map((col) => col.value);
    const results = calculatedData.map((row) => {
      const filtered = {};
      selectedColNames.forEach((colName) => {
        filtered[colName] = row[colName];
      });
      formulas.forEach(({ outputName }) => {
        filtered[outputName] = row[outputName];
      });
      return filtered;
    });

    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `Exported_${templateName || "Report"}.xlsx`);
  };

  const saveTemplate = async () => {
    if (!templateName || selectedColumns.length === 0 || formulas.length === 0)
      return;

    const templateDto = {
      name: templateName,
      columns: selectedColumns.map((col) => col.value),
      formulas: formulas.map((f) => ({
        outputColumnName: f.outputName,
        formulaString: f.formula,
        variableMappings: formulaMap,
      })),
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tools/excel/templates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(templateDto),
        }
      );

      if (!response.ok) throw new Error("Failed to save template");

      const saved = await response.json();
      alert("Template saved successfully!");
      setSavedTemplates((prev) => [...prev, saved]);
    } catch (err) {
      alert("Error saving template.");
      console.error(err);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tools/excel/templates`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const data = await response.json();
      setSavedTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
      alert("Failed to load templates");
    }
  };

  const applyTemplate = (template) => {
    setTemplateName(template.name);
  
    const selected = template.columns.map((col) => ({
      label: typeof col === "string" ? col : col.columnName,
      value: typeof col === "string" ? col : col.columnName,
    }));
    setSelectedColumns(selected);
  
    const map = template.formulas[0]?.variableMappings || {};
    setFormulaMap(map);
  
    const formulas = template.formulas.map((f) => ({
      outputName: f.outputColumnName,
      formula: f.formulaString,
    }));
    setFormulas(formulas);
    setPendingFormulas(formulas); // ✅ Wait to evaluate
  };
  

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Excel Report Import/Export Tool</h4>

      {/* Upload Excel */}
      <div className="mb-3">
        <label className="form-label">Upload Excel File</label>
        <input
          type="file"
          className="form-control"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>

      {/* Load Template */}
      {columnOptions.length > 0 && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <div className="flex-grow-1">
            <label className="form-label">Load Saved Template</label>
            <select
              className="form-select"
              onChange={(e) => {
                const tpl = savedTemplates.find(
                  (t) => t.name === e.target.value
                );
                if (tpl) applyTemplate(tpl);
              }}
              value={templateName || ""}
            >
              <option value="">Select Template</option>
              {savedTemplates.map((tpl, idx) => (
                <option key={idx} value={tpl.name}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-sm btn-outline-secondary mt-4">
            + Configure New Template
          </button>
        </div>
      )}

      {rawData.length > 0 && (
        <>
          {/* Select Columns */}
          <div className="mb-3">
            <label className="form-label">Select Columns</label>
            <Select
              options={columnOptions}
              isMulti
              value={selectedColumns}
              onChange={handleColumnSelection}
            />
          </div>

          {/* Mapping Display */}
          {Object.keys(formulaMap).length > 0 && (
            <div className="mb-3">
              <strong>Column Mappings:</strong>
              <ul>
                {Object.entries(formulaMap).map(([key, value]) => (
                  <li key={key}>
                    {key} → <code>{value}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add Formula */}
          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Formula (e.g. A/B)"
              value={formulaInput}
              onChange={(e) => setFormulaInput(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Output Column Name"
              value={outputColumnName}
              onChange={(e) => setOutputColumnName(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={addFormula}>
              Add Formula
            </button>
          </div>

          {/* List of Formulas */}
          {formulas.length > 0 && (
            <div className="mb-3">
              <strong>Formulas:</strong>
              <ul>
                {formulas.map((f, idx) => (
                  <li key={idx}>
                    <code>{f.outputName}</code> = {f.formula}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Template Save */}
          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <button className="btn btn-outline-success" onClick={saveTemplate}>
              Save Template
            </button>
          </div>

          {/* Export */}
          <div className="mb-3">
            <button
              className="btn btn-success"
              onClick={exportToExcel}
              disabled={calculatedData.length === 0}
            >
              <PiMicrosoftExcelLogoFill className="me-2" />
              Export to Excel
            </button>
          </div>

          {/* Preview */}
          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  {selectedColumns.map((col) => (
                    <th key={col.value}>{col.value}</th>
                  ))}
                  {formulas.map((f) => (
                    <th key={f.outputName}>{f.outputName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calculatedData.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {selectedColumns.map((col) => (
                      <td key={col.value}>{row[col.value]}</td>
                    ))}
                    {formulas.map((f) => (
                      <td key={f.outputName}>{row[f.outputName]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ExcelReportImportExportTool;
