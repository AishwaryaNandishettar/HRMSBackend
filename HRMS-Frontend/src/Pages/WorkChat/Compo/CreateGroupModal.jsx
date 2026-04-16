import { useState } from "react";
import { createGroup } from "../../../api/GroupChatApi";

export default function CreateGroupModal({
  users = [],
  token,
  onCreated,
  onClose,
}) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (email) => {
    setMembers((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const create = async () => {
    if (!groupName.trim()) {
      alert("Group name required");
      return;
    }

    if (members.length === 0) {
      alert("Select at least one member");
      return;
    }

    try {
      setLoading(true);

      const group = await createGroup(
        {
          groupName,
          members,
        },
        token
      );

      onCreated(group); // add to sidebar
      onClose();        // close modal
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wc-modal-backdrop">
      <div className="wc-modal group-modal">
        <h3>Create Group</h3>

        <input
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="wc-modal-users">
          {users.length === 0 && (
            <div>No users available</div>
          )}

          {users.map((u) => (
            <label key={u.email}>
              <input
                type="checkbox"
                checked={members.includes(u.email)}
                onChange={() => toggle(u.email)}
              />
              {u.name}
            </label>
          ))}
        </div>

        <div className="wc-modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            onClick={create}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
