const express = require("express");
const mysql = require("mysql");
const app = express();
const bcrypt = require("bcryptjs");
const saltRounds = 10; //The time needed to calculate a single bcrypt hash
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("./JWT");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// FIX CORS ERROR
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// Create connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "hydroponics",
  multipleStatements: true,
  timezone: "utc",
});

//Display message for connection
db.connect((err) => {
  if (!err) console.log("Db connection succeeded");
  else
    console.log(
      "DB connection failed \n Error :" + JSON.stringify(err, undefined, 2)
    );
});

//Get all users
app.get("/users", validateToken, (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

//Get user by username
app.get("/users/:username", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [req.params.username],
    (err, rows) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Get crop_name by username
app.get("/crop_name/:username", (req, res) => {
  db.query(
    "SELECT crop_name FROM users WHERE username = ?",
    [req.params.username],
    (err, rows) => {
      if (!err) {
        res.status(200).json({ rows });
      } else console.log(err);
    }
  );
});

// HOME SECTION

//Get parameters based on the crop_name
app.get("/parameters/:crop_name", (req, res) => {
  db.query(
    "SELECT * FROM parameters  WHERE crop_name = ?",
    [req.params.crop_name],
    (err, rows) => {
      if (!err) {
        res.status(200).json({ rows });
      } else console.log(err);
    }
  );
});

//Get sensors values by username
app.get("/sensors_values/:username", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [req.params.username],
    (err, rows) => {
      if (!err) {
        res.status(200).json({ rows });
      } else console.log(err);
    }
  );
});

// Get the last values from database based on username
app.get("/updated_data", (req, res) => {
  db.query(
    "SELECT * FROM sensors_values GROUP BY  sensor_id DESC LIMIT 1  ",
    [req.params.username],
    (err, rows) => {
      if (!err) {
        res.status(200).json({ rows });
      } else console.log(err);
    }
  );
});

// LOGIN SECTION

//Get all crops and pass to the template
app.get("/crops", (req, res) => {
  db.query("SELECT * FROM crop", (err, rows) => {
    if (!err) res.status(200).send(rows);
    else console.log(err);
  });
});

//Check if users exists
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(`SELECT * FROM users WHERE username = ?`, username, (err, rows) => {
    if (err) {
      console.log({ err: err });
    }

    if (rows.length > 0) {
      bcrypt.compare(password, rows[0].password, (error, response) => {
        if (response) {
          const accessToken = createTokens(response);
          console.log(response);
          res.status(200).json({ success: true, accessToken });
        } else {
          res.status(404).json({ success: false });
        }
      });
    } else {
      console.log("Wrong username");
      res.status(404).json({ success: false });
    }
  });
  console.log(req.body);
});

//Insert sensor's values
app.get(
  "/values/:humidity/:water_temp/:room_temp/:pH/:arduino_id",
  (req, res) => {
    const { humidity, water_temp, room_temp, pH, arduino_id } = req.params;
    console.log(req.params);

    db.query(
      "INSERT INTO sensors_values (humidity,water_temp,room_temp,pH,arduino_id) VALUES (?,?,?,?,?)",
      [humidity, water_temp, room_temp, pH, arduino_id],
      (err, rows) => {
        if (!err) {
          res.send(rows);
          console.log(req.params);
        } else console.log(err);
      }
    );
  }
);

//Delete user by username
app.delete("/users/delete/:username", (req, res) => {
  db.query(
    "DELETE FROM users WHERE username = ?",
    [req.params.username],
    (err, rows) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

// PROFILE SECTION

// Get user's details by username
app.get("/details/:username", (req, res) => {
  db.query(
    "SELECT username, email,crop_name FROM users WHERE username = ?",
    [req.params.username],
    (err, rows) => {
      if (!err) {
        res.status(200).json({ rows });
      } else console.log(err);
    }
  );
});
//Edit profile
app.put("/update_details/:username", (req, res) => {
  const username = req.params.username;
  const { email, crop_name } = req.body;
  db.query(
    "UPDATE users SET  email=?,crop_name=? WHERE username = ?",
    [email, crop_name, username],
    (err, rows) => {
      if (!err) res.send(rows);
      else console.log("ERROR");
    }
  );
  console.log(req.body);
});

// Change password
app.put("/update_password/:username", (req, res) => {
  const username = req.params.username;
  const { password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    db.query(
      "UPDATE users SET password=? WHERE username = ?",
      [hash, username],
      (err, rows) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
    console.log(req.body);
  });
});

// REGISTRATION SECTION

//Insert user
app.post("/register", async (req, res) => {
  const { username, password, name, email, crop_name, arduino_id } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      `SELECT arduino_id FROM arduino WHERE arduino_id = ?`,
      arduino_id,
      (err, rows) => {
        if (err) {
          console.log({ err: err });
        }
        if (rows.length > 0) {
          db.query(
            `INSERT INTO users (username,password,name,email,crop_name, arduino_id) VALUES (?,?,?,?,?,?)`,
            [username, hash, name, email, crop_name, arduino_id],
            (err, response) => {
              if (!err) {
                const accessToken = createTokens(response);
                console.log(response);
                res.status(200).json({ success: true, accessToken });
              } else {
                console.log(err);
                res.send("ERROR");
              }
            }
          );
        } else {
          res.status(404).json({ success: false });
        }
      }
    );
  });
  console.log(req.body);
});

// NOTE SECTION

// Get notes by username
app.get("/notes/:username", (req, res) => {
  db.query(
    "SELECT notes_id, date, description FROM notes WHERE username=?",
    [req.params.username],
    (err, rows) => {
      if (!err) {
        res.status(200).json({ rows });
      } else console.log(err);
    }
  );
});

//Insert note based on username
app.post("/note/:username", (req, res) => {
  const username = req.params.username;
  const { date, description } = req.body;

  db.query(
    "INSERT INTO notes (date,description,username) VALUES(?,?,?)",
    [date, description, username],
    (err, rows) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
  console.log(req.body);
});

// Delete note based on notes_id
app.delete("/delete_note/:notes_id", (req, res) => {
  db.query(
    "DELETE FROM notes WHERE notes_id = ?",
    [req.params.notes_id],
    (err, rows) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Get note based on notes_id
app.get("/get_note/:notes_id", (req, res) => {
  db.query(
    "SELECT notes_id, date, description FROM notes WHERE notes_id=?",
    [req.params.notes_id],
    (err, rows) => {
      if (!err) {
        res.status(200).json({ rows });
      } else console.log(err);
    }
  );
});

// Edit note based on notes_id

app.put("/update_note/:notes_id", (req, res) => {
  const notes_id = req.params.notes_id;
  const { description } = req.body;
  db.query(
    "UPDATE notes SET  description=? WHERE notes_id = ?",
    [description, notes_id],
    (err, rows) => {
      if (!err) res.send(rows);
      else console.log("ERROR");
    }
  );
  console.log(req.body);
});

// DISPLAY PORT NUMBER
app.listen("5000", () =>
  console.log("Express server is running at port number 5000")
);
