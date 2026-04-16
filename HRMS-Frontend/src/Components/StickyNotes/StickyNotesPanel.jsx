import React, { useContext, useState } from "react";
import { StickyNotesContext } from "./StickyNotesProvider";
import StickyNote from "./StickyNote";
import "./sticky.css";

const colors = ["#FFF59D", "#FFAB91", "#90CAF9", "#A5D6A7"];

const StickyNotesPanel = () => {
  const { notes, setNotes, panelOpen, setPanelOpen } = useContext(StickyNotesContext);
  const [text, setText] = useState("");
  const [color, setColor] = useState(colors[0]);

  const addNote = () => {
    if (!text.trim()) return;
    setNotes([
      ...notes,
      {
        id: Date.now(),
        text,
        color,
        x: 200,
        y: 180,
      },
    ]);
    setText("");
  };

  return (
    <>
      {/* Floating Sticky Icon */}
      <div className="sticky-icon" onClick={() => setPanelOpen(!panelOpen)}>
        📝
      </div>

      {panelOpen && (
        <div className="sticky-panel">
          <h3>Add Sticky Note</h3>

          <textarea
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="color-row">
            {colors.map((c) => (
              <div
                key={c}
                className="color-btn"
                style={{ background: c, border: color === c ? "3px solid black" : "none" }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <button className="add-btn" onClick={addNote}>Add Note</button>
        </div>
      )}

      {/* Render All Notes */}
      {notes.map((n) => (
        <StickyNote key={n.id} note={n} />
      ))}
    </>
  );
};

export default StickyNotesPanel;
