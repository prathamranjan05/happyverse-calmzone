import "./PortalLoading.css";

export default function PortalLoading({ message = "TRAVELING THROUGH PORTAL..." }) {
  return (
    <div className="portal-loading-container">
      {/* The message is now the only element, centered via the container */}
      <div className="loading-message">{message}</div>
    </div>
  );
}