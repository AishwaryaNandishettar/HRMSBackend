import React, { useContext, useState } from "react";
import { StickyNotesContext } from "./StickyNotesProvider";


const StickyNote = ({ note }) => {
  const { notes, setNotes } = useContext(StickyNotesContext);
  const [pos, setPos] = useState({ x: note.x, y: note.y });

  const startDrag = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = pos.x;
    const origY = pos.y;

    const onDrag = (moveEvent) => {
      setPos({
        x: origX + (moveEvent.clientX - startX),
        y: origY + (moveEvent.clientY - startY),
      });
    };

    const stopDrag = () => {
      setNotes(
        notes.map((n) =>
          n.id === note.id ? { ...n, x: pos.x, y: pos.y } : n
        )
      );

      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const deleteNote = () => {
    setNotes(notes.filter((n) => n.id !== note.id));
  };

  return (
    <div
      className="sticky-note"
      style={{ background: note.color, left: pos.x, top: pos.y }}
      onMouseDown={startDrag}
    >
      {note.text}
      <button className="delete-btn" onClick={deleteNote}>×</button>
    </div>
  );
};

export default StickyNote;
