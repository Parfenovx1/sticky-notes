import { createContext, useEffect, useState } from "react";
import { Spinner } from "../icons/Spinner";
import { db } from "../../appwrite/databases";

export const NoteContext = createContext();

const NoteProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const response = await db.notes.list();
    response && setNotes(response.documents);
    setLoading(false);
  };

  const contextData = { notes, setNotes, selectedNote, setSelectedNote };

  return (
    <NoteContext.Provider value={contextData}>
      {loading ? (
        <div className="loading">
          <Spinner size="100" />
        </div>
      ) : (
        children
      )}
    </NoteContext.Provider>
  );
};

export default NoteProvider;
