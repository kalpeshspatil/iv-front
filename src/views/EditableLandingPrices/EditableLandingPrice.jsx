import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../constants.js";
import { FaEdit, FaCheck } from "react-icons/fa";
import "./EditableLandingPrice.css";

export function EditableTable() {
  const [editingIndex, setEditingIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [editableData, setEditableData] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setEditableData(data); // Sync for editing
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (index, value) => {
    const updated = [...editableData];
    updated[index].productLandingPrice = value;
    setEditableData(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = () => {
    console.log("Updated Data:", editableData);
    setEditingIndex(null);

    // TODO: Optional - Add API call to save updated price
    // Example:
     const updatedProduct = editableData[editingIndex];
     fetch(`${API_BASE_URL}/api/products`, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(updatedProduct),
     });
  };

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Landing Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {editableData.map((product, index) => (
          <tr key={product.id || index}>
            <td>{product.productBrand + " " + product.productName}</td>
            <td>
              {editingIndex === index ? (
                <input
                  type="number"
                  value={product.productLandingPrice}
                  className="edit-price-inputbox"
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                />
              ) : (
                product.productLandingPrice
              )}
            </td>
            <td>
              {editingIndex === index ? (
                <button className="btn small-btn" onClick={handleSave}>
                  <FaCheck className="save-icon" />
                </button>
              ) : (
                <button
                  className="btn btn-primary small-btn"
                  onClick={() => handleEdit(index)}
                >
                  <FaEdit className="edit-icon" />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EditableTable;
