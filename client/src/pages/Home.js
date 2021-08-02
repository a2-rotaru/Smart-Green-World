import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./../CSS/Home.css";
import humidity from "../images/humidity.png";
import water_temp from "../images/water_temp.png";
import room_temp from "../images/room_temp.png";
import warning from "../images/warning.png";
import ph from "../images/ph.png";
import Footer from "./Footer";
import MobileHome from "./MobileHome";

const Home = ({ history }) => {
  const [cropname, setCropname] = useState("");
  const [message, setMessage] = useState("");
  const [advice, setAdvice] = useState("");

  const [values, setValues] = useState({
    minHumidity: "",
    maxHumidity: "",
    minRoomTemp: "",
    maxRoomTemp: "",
    minWaterTemp: "",
    maxWaterTemp: "",
    minpH: "",
    maxpH: "",
  });

  const [data, setData] = useState({
    humidity: "",
    room_temp: "",
    water_temp: "",
    pH: "",
  });

  //GET CROP NAME
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      async function getCrop() {
        await axios
          .get(`/crop_name/${localStorage.getItem("username")}`)
          .then((response) => {
            // console.log(response.data.rows[0].crop_name);
            localStorage.setItem("crop_name", response.data.rows[0].crop_name);
            setCropname(response.data.rows[0].crop_name);
          });
      }

      getCrop();
    }
  }, [history]);

  //GET LIVE DATA
  useEffect(() => {
    const intervalID = setInterval(() => {
      async function getValues() {
        try {
          await axios.get(`/updated_data/`).then((response) => {
            const responseData = response.data.rows[0];
            setData({
              humidity: responseData.humidity,
              room_temp: responseData.room_temp,
              water_temp: responseData.water_temp,
              pH: responseData.pH,
            });
          });
        } catch (error) {
          console.log(error);
        }
      }
      getValues();
    }, 10000);

    return () => clearInterval(intervalID);
  }, []);

  // GET PARAMETERS

  useEffect(() => {
    async function getParameters() {
      try {
        await axios
          .get(`/parameters/${localStorage.getItem("crop_name")}`)
          .then((response) => {
            const responseValues = response.data.rows[0];
            setValues({
              minHumidity: responseValues.min_humidity,
              maxHumidity: responseValues.max_humidity,
              minRoomTemp: responseValues.min_room_temp,
              maxRoomTemp: responseValues.max_room_temp,
              minWaterTemp: responseValues.min_water_temp,
              maxWaterTemp: responseValues.max_water_temp,
              minpH: responseValues.min_pH,
              maxpH: responseValues.max_pH,
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
    getParameters();
  }, [cropname]);

  // COMPARE VALUES

  useEffect(() => {
    switch (true) {
      case data.humidity < values.minHumidity:
        setMessage("The humidity is below the range!");
        setAdvice("Turn on the humidifier.");
        break;

      case data.humidity > values.maxHumidity:
        setMessage("The humidity is above the range!");
        setAdvice("Turn on the dehumidifier or turn on the fans.");
        break;

      case data.water_temp < values.minWaterTemp:
        setMessage("The water temperature is below the range!");
        setAdvice("Turn on the water tank heater.");
        break;
      case data.water_temp > values.maxWaterTemp:
        setMessage("The water temperature is above the range!");
        setAdvice(
          "A simple solution is to keep 10-15 ice packs on hand and add one to your reservoir every 15 minutes until the desired temperature is reached."
        );
        break;

      case data.room_temp < values.minRoomTemp:
        setMessage("The room temperature is below the range!");
        setAdvice("Turn on the heat.");
        break;

      case data.room_temp > values.maxRoomTemp:
        setMessage("The room temperature is above the range!");
        setAdvice("Turn off the heat.");
        break;

      case data.pH < values.minpH:
        setMessage("The pH is below the range!");
        setAdvice("Add a few drops of pH Up solution and mix.");
        break;

      case data.pH > values.maxpH:
        setMessage("The pH is above the range!");
        setAdvice("Add a few drops of pH Down solution and mix.");
        break;

      case data.humidity >= values.minHumidity ||
        data.humidity <= values.maxHumidity ||
        data.room_temp >= values.minRoomTemp ||
        data.room_temp <= values.maxRoomTemp ||
        data.water_temp >= values.minWaterTemp ||
        data.water_temp <= values.maxWaterTemp ||
        data.pH >= values.minpH ||
        data.pH <= values.maxpH:
        setMessage("");
        setAdvice("");
        break;
    }
  }, [data]);

  return (
    <>
      <div className="home">
        <Navbar />
        <div className="home-container">
          <div className="home-title">
            <h1>Welcome {localStorage.getItem("username")}! </h1>
            <h2>Check the parameters for your {cropname}</h2>
            <h4>Current values</h4>
          </div>

          <div className="value-icon">
            <img src={humidity} alt="Humidity icon" className="icons" />
            <img
              src={water_temp}
              alt="Water temperature icon"
              className="icons"
            />

            <img
              src={room_temp}
              alt="Room temperature icon"
              className="icons"
            />
            <img src={ph} alt="pH icon" className="icons" />
          </div>
          <div className="live-parameters">
            <label className="live-humidity">{data.humidity} %</label>
            <label className="waterTemp">{data.water_temp} °C</label>
            <label className="roomTemp">{data.room_temp} °C</label>
            <label className="live-pH">{data.pH}</label>
          </div>
          <div className="crop-title">
            <h4>Excellent values for {cropname}</h4>
          </div>
          <div className="crop-icons">
            <img src={humidity} alt="Humidity icon" className="icons" />
            <img
              src={water_temp}
              alt="Water temperature icon"
              className="icons"
            />
            <img
              src={room_temp}
              alt="Room temperature icon"
              className="icons"
            />
            <img src={ph} alt="pH icon" className="icons" />
          </div>
          <div className="crop-parameters">
            <label className="humidity">
              {values.minHumidity}- {values.maxHumidity} %
            </label>
            <label className="waterTemp">
              {values.minWaterTemp} - {values.maxWaterTemp} °C
            </label>
            <label className="roomTemp">
              {values.minRoomTemp} - {values.maxRoomTemp} °C
            </label>
            <label className="pH">
              {values.minpH} - {values.maxpH}
            </label>
          </div>
          <div className="advice">
            {message && message != " " ? (
              <img src={warning} alt="warning icon" className="warning-icon" />
            ) : (
              " "
            )}
            <div className="warning-message">{message} </div>
            <div className="advice-message">{advice}</div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </div>
      </div>
      <MobileHome />
    </>
  );
};
export default Home;
