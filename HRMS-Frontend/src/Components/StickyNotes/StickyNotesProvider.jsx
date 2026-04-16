import React, { createContext, useState, useEffect } from "react";
import StickyNotesPanel from "./StickyNotesPanel";

export const StickyNotesContext = createContext();

const StickyNotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("stickyNotes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }, [notes]);

  return (
    <StickyNotesContext.Provider
      value={{ notes, setNotes, panelOpen, setPanelOpen }}
    >
      {children}
      <StickyNotesPanel />
    </StickyNotesContext.Provider>
  );
};

export default StickyNotesProvider;
