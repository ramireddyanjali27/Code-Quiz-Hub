import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import './Common.css';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="error-container">
      <FiAlertTriangle className="error-icon" />
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          <FiRefreshCw /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
