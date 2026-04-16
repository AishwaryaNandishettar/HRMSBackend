const emojis = ["😀", "😂", "😍", "😎", "😭", "👍", "🔥", "🎉"];

export default function EmojiPicker({ visible, onSelect }) {
  if (!visible) return null;

  return (
    <div className="wc-emoji-picker">
      {emojis.map((e) => (
        <button
          key={e}
          className="emoji-btn"
          onClick={() => onSelect(e)}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
