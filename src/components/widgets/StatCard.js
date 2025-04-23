import "./Widget.css";

// This is the small card you're rendering directly inside
const StatCard = ({ color, leftValue, leftLabel, rightValue, rightLabel }) => (
  <div className="card h-100 top-border-no-radius" style={{ '--cui-card-cap-bg': color }}>
    <div className="card-body row text-center">
      <div className="col">
        <div className="fs-5 fw-semibold">{leftValue}</div>
        <div className="text-uppercase text-body-secondary small">{leftLabel}</div>
      </div>
      <div className="vr"></div>
      <div className="col">
        <div className="fs-5 fw-semibold">{rightValue}</div>
        <div className="text-uppercase text-body-secondary small">{rightLabel}</div>
      </div>
    </div>
  </div>
);

export default StatCard;