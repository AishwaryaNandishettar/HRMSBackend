export default function UserSelectModal({ onClose }) {
  return (
    <div className="wc-modal">
      <h4>Select User</h4>
      <ul>
        <li>HR</li>
        <li>Manager</li>
        <li>Employee</li>
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
