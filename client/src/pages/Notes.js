import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/Notes.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Note from "../components/Note";
import NoteIcon from "../images/note.png";
import { useHistory } from "react-router";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [error, setError] = useState("");

  // GET THE NOTES

  useEffect(() => {
    async function getNotes() {
      try {
        await axios
          .get(`/notes/${localStorage.getItem("username")}`)
          .then((response) => {
            console.log(response.data.rows);
            setNotes(response.data.rows);
          });
      } catch (error) {
        console.log(error);
      }
    }
    getNotes();
  }, []);

  // DELETE NOTES
  const deleteNote = async (e) => {
    e.preventDefault();
    console.log(selectedNote);
    try {
      await axios.delete(`/delete_note/${selectedNote}`).then((response) => {
        console.log(response.data.rows);
        setNotes(response.data.rows);
        setNotes(notes.filter((note) => note.notes_id !== selectedNote));
      });
    } catch (error) {
      setError("Please select a note!");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // REDIRECT TO ADD NOTE
  const history = useHistory();
  function addNote() {
    history.push("/add-note");
  }

  // REDIRECT TO EDIT NOTE
  function editNote() {
    if (selectedNote === "") {
      setError("Please select a note!");
      console.log("Please select a note");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      history.push(`/edit-note/${selectedNote}`);
    }
  }
  return (
    <div>
      <Navbar />
      <div className="notes-container">
        <h1 className="title"> {localStorage.getItem("username")}'s notes</h1>
        <div className="note-icon">
          <img src={NoteIcon} alt="note icon" className="note-icon" />
          {error && <span className="note-error">{error}</span>}
        </div>
        {notes && notes.length > 0 ? (
          <>
            <div className="note-section">
              <h3 className="date-title">Date</h3>
              <h3 className="description-title">Description</h3>
              {notes &&
                notes.map((note) => {
                  return (
                    <Note
                      key={note.notes_id}
                      note={note}
                      setSelectedNote={setSelectedNote}
                    />
                  );
                })}
            </div>
          </>
        ) : (
          <div className="message-note">
            <h4>There are no notes</h4>
          </div>
        )}

        <div className="click">
          <button className="add" onClick={addNote}>
            Add Note
          </button>
          <button className="delete" onClick={deleteNote}>
            Delete Note
          </button>
          <button className="edit" onClick={editNote}>
            Edit Note
          </button>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Notes;
