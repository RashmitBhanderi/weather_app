import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Card,
  Snackbar,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";

// Styles
import styles from "./Home.module.css";
import globalStyles from "./Global.module.css";
import Search from "./Search";

let API_KEY = "715a699411f5e1e38d73a4f4273b5da2";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

let icons = {
  Rain: "fas fa-cloud-showers-heavy",
  Clouds: "fas fa-cloud",
  Clear: "fas fa-cloud-sun",
  Snow: "fas fa-snowman",
  Sunny: "fas fa-sun",
  Mist: "fas fa-smog",
  Thunderstorm: "fas fa-thunderstorm",
  Drizzle: "fas fa-thunderstorm",
};
let imageMapper = {
  Clouds: "url(img/cloudy.jpg)",
  Rain: "url(img/rainy.jpg)",
  Clear: "url(img/clear.jpg)",
  Snow: "url(img/snowy.jpg)",
  Sunny: "url(img/sunny.jpg)",
  Thunderstorm: "url(img/thunderstrom.jpg)",
  Drizzle: "url(img/drizzle.jpg)",
  Mist: "url(img/mist.jpg)",
  Haze: "url(img/mist.jpg)",
  Fog: "url(img/mist.jpg)",
};

const ForcastCard = ({ data }) => {
  console.log("data", data);
  return (
    <Card className={styles.forcastCard}>
      <h3 className={styles.date}>
        {moment(data.dt_txt, "YYYY-MM-DD HH:mm:ss").format("hh:mm a (dddd)")}
      </h3>
      <h2 className={styles.temp}>
        {(data.main.temp - 273.15).toFixed(2)}&deg;C
      </h2>
      <p className={styles.condition}>
        {data.weather[0].description}{" "}
        <i class={icons[data.weather[0].main]}></i>
      </p>
      <p className={styles.maxMin}>
        {Math.floor(data.main.temp_min - 273.15)}&deg;C (min) /{" "}
        {Math.ceil(data.main.temp_max - 273.15)}&deg;C (max)
      </p>
      <div className={styles.details}>
        <div className={styles.row}>
          <p className={styles.col}>
            Feels like : {Math.floor(data.main.feels_like - 273.15)}&deg;C
          </p>
          <p className={styles.col}>Wind : {data.wind.speed} KMPH</p>
        </div>
      </div>
    </Card>
  );
};

const Home = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongtitude] = useState("");
  const [weather, setWeather] = useState({ main: {} });
  const [forcast, setForcast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openGuide, setOpenGuide] = useState(false);

  const getCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongtitude(longitude);
        await loadForcastData(latitude, longitude);
        await loadWeatherData(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            "Access to geolocation was denied. To regain access, please reset the location permission."
          );
        } else {
          setMessage(
            "An error occurred while requesting geolocation. Please reset the permission for location."
          );
        }
      }
    );
  };

  const loadForcastData = async (lat, long) => {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}`;
    try {
      const { data = {} } = await axios.get(URL);
      const { list = [] } = data;
      setForcast(list);
    } catch (e) {
      setMessage("Weather forcast data failed to fetch, please try again!");
    }
  };

  const loadWeatherData = async (lat, long) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`;
    try {
      const { data = {} } = await axios.get(URL);
      setWeather(data);
    } catch (e) {
      setMessage("Weather data failed to fetch, please try again!");
    }
  };

  const searchByName = async (value) => {
    const city = value.trim();
    if (city === "") return;
    setIsLoading(true);
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${API_KEY}`;
    try {
      const { data = {} } = await axios.get(URL);
      setWeather(data);
    } catch (e) {
      setMessage("Weather data failed to fetch, please try again!");
    }
    const ForcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${API_KEY}`;
    try {
      const { data = {} } = await axios.get(ForcastURL);
      const { list = [] } = data;
      setForcast(list);
    } catch (e) {
      console.log("Weather forcast data failed to fetch, please try again!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: imageMapper[weather?.weather?.[0]?.main || "Clouds"],
      }}
    >
      <div className={`${styles.header} ${globalStyles.frbc}`}>
        <h1 className={styles.heading}>
          {moment().format("DD MMM, YYYY (dddd)")}
        </h1>
        <div className={`${styles.searchBtn} ${globalStyles.frcc}`}>
          <Search onClick={(e) => searchByName(e)} />
        </div>
        <div className={styles.actions}>
          <Button
            variant="contained"
            className={styles.btn}
            onClick={() => setOpenGuide(true)}
          >
            User Guide
          </Button>
        </div>
      </div>

      <div className={`${styles.weather} ${globalStyles.fccc}`}>
        {isLoading ? (
          <p className={styles.location}>Loading........</p>
        ) : (
          <>
            <p className={styles.location}>
              {weather.name}, {weather?.sys?.country}
            </p>
            <h2 className={styles.temprature}>
              {Math.round(weather.main.temp - 273.15)}&deg;C
            </h2>
            <p className={styles.condition}>
              {weather.weather[0].main}{" "}
              <i className={icons[weather.weather[0].main]}></i>
            </p>
            <p className={styles.maxMin}>
              {Math.floor(weather.main.temp_min - 273.15)}&deg;C (min) /{" "}
              {Math.ceil(weather.main.temp_max - 273.15)}&deg;C (max)
            </p>
            <div className={styles.details}>
              <div className={styles.row}>
                <p className={styles.col}>
                  Feels like : {Math.floor(weather.main.feels_like - 273.15)}
                  &deg;C
                </p>
                <p className={styles.col}>
                  Humidity : {weather.main.humidity}%
                </p>
              </div>
              <div className={styles.row}>
                <p className={styles.col}>
                  Pressure : {weather.main.pressure} mb
                </p>
                <p className={styles.col}>Wind : {weather.wind.speed} KMPH</p>
              </div>
            </div>
          </>
        )}
      </div>

      {isLoading && forcast.length > 0 ? (
        ""
      ) : (
        <div className={`${styles.forcast} ${globalStyles.frcc}`}>
          {forcast.map((e, i) => (
            <ForcastCard data={e} index={i} />
          ))}
        </div>
      )}
      <Snackbar
        open={message !== ""}
        autoHideDuration={6000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Modal
        open={openGuide}
        onClose={() => setOpenGuide(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Guide
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
