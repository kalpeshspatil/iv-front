import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../constants.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productBrand: "",
  });

  const recordsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(products.length / recordsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewProduct({ productName: "", productBrand: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
   fetch(`${API_BASE_URL}/api/products`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(newProduct), // Convert the JavaScript object to JSON
       })
         .then((response) => {
           if (!response.ok) {
             alert("Something went wrong, challan not submitted");
             throw new Error(`HTTP error! Status: ${response.status}`);
           }
           return response.json(); // Parse JSON only if response is OK
         })
         .then((data) => {
           console.log("Success:", data);
           toast.success("Entry added successfully!", {
             position: "top-right",
             autoClose: 3000,
           });
           closeModal(); // Now it only runs on success
         })
         .catch((error) => {
           console.error("Error:", error);
         });
    
    console.log("Saving product:", newProduct);
    closeModal();
  };

  return (
    <div className="ledger-container p-0">
      {/* Top Right Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={openModal}>
          + Add Product
        </button>
      </div>

      {/* Table */}
      <table className="ledger-table table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Rate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No records found.
              </td>
            </tr>
          ) : (
            currentRecords.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.productBrand}</td>
                <td>{item.productLandingPrice}</td>
                <td>
                  <button>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {products.length > recordsPerPage && (
        <div className="d-flex justify-content-between align-items-center mt-4 gap-2 pagination">
          <div className="d-flex">
            <button
              className="btn btn-sm btn-outline-secondary pagination-small-btn"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    currentPage === page
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } pagination-small-btn`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="btn btn-sm btn-outline-secondary pagination-small-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Product</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    value={newProduct.productName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Product Brand</label>
                  <input
                    type="text"
                    name="productBrand"
                    value={newProduct.productBrand}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
