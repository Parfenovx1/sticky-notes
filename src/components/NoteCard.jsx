import { useEffect, useRef, useState, useContext } from "react";
import { Spinner } from "../icons/Spinner";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { db } from "../../appwrite/databases";
import { DeleteButton } from "./DeleteButton";
import { NoteContext } from "../context/NoteContext";

export const NoteCard = ({ note }) => {
  const [position, setPosition] = useState(JSON.parse(note.position));
  const [saving, setSaving] = useState(false);

  const { setSelectedNote } = useContext(NoteContext);

  let mouseStartPos = { x: 0, y: 0 };

  const cardRef = useRef(null);
  const textAreaRef = useRef(null);
  const keyUpTimer = useRef(null);

  const colors = JSON.parse(note.colors);
  const body = bodyParser(note.body);

  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };

    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyUp = () => {
    setSaving(true);

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      setSelectedNote(note);
      setZIndex(cardRef.current);

      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    saveData("position", newPosition);
  };

  const mouseMove = (e) => {
    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={mouseDown}
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton noteId={note.$id} />
        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
          ref={textAreaRef}
          style={{ color: colors.colorText }}
          defaultValue={body}
        ></textarea>
      </div>
    </div>
  );
};
