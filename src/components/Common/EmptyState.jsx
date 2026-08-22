import { FiInbox } from 'react-icons/fi';
import './Common.css';

const EmptyState = ({ icon, title = 'No data found', message, action, onAction }) => {
  return (
    <div className="empty-state">
      {icon || <FiInbox className="empty-icon" />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
