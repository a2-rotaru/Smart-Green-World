import "../CSS/Notes.css";
import { useState } from "react";

const Note = ({ note, setSelectedNote }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
    const id = note.notes_id;
    console.log(id);
    setSelectedNote(id);
  };
  return (
    <>
      <div className="date">{note.date.toString().substring(0, 10)}</div>

      <div className="description">{note.description}</div>
      <input
        className="checkbox"
        type="checkbox"
        checked={isChecked}
        onChange={handleOnChange}
      ></input>
    </>
  );
};

export default Note;
