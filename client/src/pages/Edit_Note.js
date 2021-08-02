import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/Add_Note.css";
import { useEffect, useState } from "react";
import axios from "axios";
import NoteIcon from "../images/note.png";
import { useHistory, useParams } from "react-router";

const Edit_Note = () => {
  // GET SELECTED NOTE
  const [note, setNote] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function getNote() {
      try {
        await axios.get(`/get_note/${id}`).then((response) => {
          setNote(response.data.rows[0].description);
          console.log(response.data.rows[0].description);
        });
      } catch (error) {
        console.log(error);
      }
    }
    getNote();
  }, []);

  // UPDATE FUNCTION
  const [noteUpdate, setNoteUpdate] = useState("");

  const update_note = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/update_note/${id}`, {
        description: noteUpdate ? noteUpdate : note,
      });
      submitChanges();
    } catch (error) {
      console.log(error);
    }
  };
  // REDIRECT TO NOTES PAGE
  const history = useHistory();
  function submitChanges() {
    history.push("/note");
  }

  return (
    <div>
      <Navbar />
      <div className="add-container">
        <div className="note-icon">
          <img src={NoteIcon} alt="note icon" className="note-icon" />
        </div>
        <form onSubmit={update_note}>
          <div className="edit-body">
            <h3>Description</h3>
            <textarea
              className="input"
              defaultValue={note}
              onChange={(e) => {
                setNoteUpdate(e.target.value);
              }}
              rows="5"
              cols="2"
            ></textarea>

            <button className="submit">Submit Note</button>
          </div>
        </form>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Edit_Note;
