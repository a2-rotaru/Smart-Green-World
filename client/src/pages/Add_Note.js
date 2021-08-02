import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/Add_Note.css";
import { useState } from "react";
import axios from "axios";
import NoteIcon from "../images/note.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router";

const Add_Note = () => {
  const [startDate, setStartDate] = useState(new Date());
  // INSERT FUNCTION
  const [add_note, setNote] = useState("");

  const insert = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/note/${localStorage.getItem("username")}`, {
        description: add_note,
        date: startDate,
      });
      checkNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // REDIRECT TO NOTES PAGE
  const history = useHistory();
  function checkNotes() {
    history.push("/note");
  }

  return (
    <div>
      <Navbar />
      <div className="add-container">
        <div className="note-icon">
          <img src={NoteIcon} alt="note icon" className="note-icon" />
        </div>
        <form onSubmit={insert}>
          <div className="add-section">
            <h3 className="date-title">Date</h3>
            <DatePicker
              className="datePicker"
              utcOffset={0}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <h3 className="description-title">Description</h3>
            <textarea
              className="input"
              onChange={(e) => {
                setNote(e.target.value);
              }}
              rows="5"
              cols="2"
            ></textarea>
          </div>
          <div className="add-button-section">
            <button className="addNote">Submit Note</button>
          </div>
        </form>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Add_Note;
