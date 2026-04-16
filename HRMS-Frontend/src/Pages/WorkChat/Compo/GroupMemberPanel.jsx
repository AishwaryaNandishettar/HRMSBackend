export default function GroupMembersPanel({
  group,
  loggedInEmail,
  onClose,
  onRemoveMember,
}) {
  if (!group) return null;

  const isAdmin = group.adminEmail === loggedInEmail;

  return (
    <>
      {/* OVERLAY */}
      <div className="wc-panel-overlay" onClick={onClose} />

      {/* PANEL */}
      <div className="wc-group-panel slide-in">
        <div className="wc-group-panel-header">
          <h3>Group Members</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="wc-group-panel-body">
          {group.memberEmails?.map((email) => {
            const memberIsAdmin = email === group.adminEmail;

            return (
              <div key={email} className="wc-group-member">
                <span>{email}</span>

                {memberIsAdmin && (
                  <span className="wc-admin-badge">Admin</span>
                )}

                {isAdmin && email !== loggedInEmail && (
                  <button
                    className="wc-danger-btn"
                    onClick={() => onRemoveMember?.(email)}
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
