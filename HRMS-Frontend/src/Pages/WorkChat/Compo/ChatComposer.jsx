import { useState } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip } from "react-icons/fa";
import EmojiPicker from "./EmojiPicker";

export default function ChatComposer({ onSend }) {
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [file, setFile] = useState([]);

  const send = () => {
   if (!text.trim() && file.length === 0) return;

    onSend(text, file);   // 🔥 supports text OR file
    setText("");
    setFile([]);
    setEmojiOpen(false);
  };

  return (
    <div className="wc-composer">
      <button
        className="wc-icon-btn"
        onClick={() => setEmojiOpen(!emojiOpen)}
      >
        <FaSmile />
      </button>

      <label className="wc-icon-btn">
        <FaPaperclip />
        <input
          type="file"
          hidden
          multiple
         onChange={(e) => setFile(Array.from(e.target.files))}
          key={file.length}   // 🔥 add this
        />
      </label>

      <div className="wc-input-wrap">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

{file.length > 0 && (
  <div className="wc-file-preview">
    {file.map((f, i) => (
      <div key={i} className="wc-file-item">
        📎 {f.name}
      </div>
    ))}
  </div>
)}
        <EmojiPicker
          visible={emojiOpen}
          onSelect={(emoji) =>
            setText((prev) => prev + emoji)
          }
        />
      </div>

      <button className="wc-send-btn" onClick={send}>
        <FaPaperPlane />
      </button>
    </div>
  );
}
