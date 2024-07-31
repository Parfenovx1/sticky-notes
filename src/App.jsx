import { NotesPage } from "./pages/NotesPage";
import NoteProvider from "./context/NoteContext";

export function App() {
  return (
    <div id="app">
      <NoteProvider>
        <NotesPage />
      </NoteProvider>
    </div>
  );
}
