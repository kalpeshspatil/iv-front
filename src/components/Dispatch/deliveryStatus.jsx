import React, { useState, useEffect } from "react";

const DeliveryStatusModal = ({
  show,
  challan,
  selectedPartyId,
  isVehicleRequired,
  onClose,
  onConfirm,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [dateOptions, setDateOptions] = useState([]);
  const [error, setError] = useState("");

useEffect(() => {
  if (challan && show) {
    const createdDate = new Date(challan.orderPlacedDate);
    const options = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(createdDate);
      d.setDate(d.getDate() + i);
      options.push(d.toISOString().split("T")[0]);
    }
    setDateOptions(options);

    setError("");
    setVehicleNumber(challan.vehicleNumber || "");

    if (challan.orderDeliveryDate) {
      setDeliveryDate(challan.orderDeliveryDate);
    } else {
      setDeliveryDate(null);
    }
  }
}, [challan, show]);


  const handleConfirm = () => {
    if (isVehicleRequired && !vehicleNumber.trim()) {
      setError("Vehicle number is required for final delivery.");
      return;
    }

    onConfirm({ vehicleNumber, deliveryDate });
  };

  if (!show || !challan) return null;

  const vehicleNumberRequired = isVehicleRequired;
  const isConfirmDisabled = !deliveryDate || (vehicleNumberRequired && !vehicleNumber);

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mark as Delivered</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label>
                Vehicle Number{" "}
                {vehicleNumberRequired && <span className="text-danger">*</span>}
              </label>
              <input
                type="text"
                className="form-control"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder={vehicleNumberRequired ? "Required" : "Optional"}
              />
              {error && <div className="text-danger mt-1">{error}</div>}
            </div>

            <div className="mb-3">
              <label>Select Delivery Date</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {dateOptions.map((date) => (
                  <button
                    key={date}
                    className={`btn ${
                      deliveryDate === date
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setDeliveryDate(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label>Or select a custom date</label>
              <input
                type="date"
                className="form-control"
                value={deliveryDate || ""}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatusModal;
