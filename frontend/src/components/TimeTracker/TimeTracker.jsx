import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import "./TimeTracker.css";

function TimeTracker() {
  const [time, setTime] = useState({ seconds: 0, minutes: 0, hours: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const [myData, setMyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalTime, setTotalTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [flag, setFlag] = useState(true);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:4003/api/v1/sessions");
      setMyData(data.sessions);
      return data;
    } catch (err) {
      console.log("Error while fetching the data");
    }
  };

  const handleAddSession = async (t, s, e) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4003/api/v1/session/new",
        {
          description: "",
          totalTime: t,
          startTime: s,
          endTime: e,
        }
      );
      // console.log(data);
      setMyData(data);
    } catch (error) {
      console.log("hi");
      console.log(error.response.data);
    }
  };

  let tt;
  let st;
  let et;
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = { ...prevTime };

          newTime.seconds += 1;
          if (newTime.seconds >= 60) {
            newTime.seconds = 0;
            newTime.minutes += 1;
            if (newTime.minutes >= 60) {
              newTime.minutes = 0;
              newTime.hours += 1;
            }
          }

          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }

    if (isRunning) {
      const x =
        formatTime(time.hours) +
        ":" +
        formatTime(time.minutes) +
        ":" +
        formatTime(time.seconds);

      tt = x;

      setTotalTime(x);

      setTime({ seconds: 0, minutes: 0, hours: 0 });
    }

    const currentDate = new Date(Date.now());
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).format(currentDate);

    if (flag) {
      setStartTime(formattedDate);
      console.log("hi");
      console.log(formattedDate);
      setStartTime(formattedDate);
      setFlag(!flag);
      // console.log(forattedDate);
    } else {
      setEndTime(formattedDate);
      setFlag(!flag);
      et = formattedDate;
      st = startTime;
      handleAddSession(tt, st, et);
    }
  };

  const formatTime = (value) => {
    return value.toString().padStart(2, "0");
  };

  useEffect(() => {
    fetchNotes().then((data) => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {}, [myData]);
  useEffect(() => {}, [endTime, startTime, totalTime]);

  return (
    <Box
      sx={{
        // border: "2px solid black",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Box
        className="time-tracker-navbar"
        sx={{
          //   border: "2px solid black",
          width: "100%",
          height: "10vh",
          boxShadow: "0 1px 9px 0 rgba(247,245,245,.4196078431372549)",
          borderBottom: "0.01rem solid #607D8B",
        }}
      ></Box>

      <Box
        className="main-container"
        sx={{
          //   border: "2px solid black",
          width: "100%",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          className="tracker-sidebar"
          sx={{
            // border: "2px solid black",
            width: "16%",
            height: "100%",
            borderRight: "0.01rem solid #607D8B",
          }}
        ></Box>
        <Box
          className="tracker-main-container"
          sx={{
            // border: "2px solid black",
            width: "84%",
            height: "100%",
            backgroundColor: "#f2f6f8",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Box
            className="tracker-main-container-section-one"
            sx={{
              //   border: "1px solid black",
              width: "100%",
              height: "21vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              className="tracker-main-container-section-one-timer-container"
              sx={{
                width: "95%",
                height: "40%",
                border: "1px solid #C6D2D9",
                borderRadius: "2px",
                backgroundColor: "#fefefe",
                boxShadow: "0 0 20px #0000001a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                className="tracker-description-container"
                sx={{
                  //   border: "1px solid black",
                  width: "55%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input type="text" placeholder="What are you working on ?" />
              </Box>
              <Box
                className="tracker-options-container"
                sx={{
                  //   border: "1px solid black",
                  width: "45%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  className="add-project-section"
                  sx={{
                    // border: "1px solid black",
                    height: "100%",
                    width: "25%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AddCircleOutlineIcon
                    sx={{
                      fontSize: "18px",
                      marginRight: "5px",
                      color: "#03a9f4",
                    }}
                  />
                  <Typography
                    variant="p"
                    sx={{
                      fontWeight: "500",
                      color: "#03a9f4",
                      fontSize: "15px",
                    }}
                  >
                    Project
                  </Typography>
                </Box>
                <Box
                  className="tags-section"
                  sx={{
                    // border: "1px solid black",
                    height: "100%",
                    width: "25%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Divider orientation="vertical" />
                  <SellOutlinedIcon
                    sx={{
                      color: "#808080b8",
                    }}
                  />
                  <Divider orientation="vertical" />
                  <CurrencyRupeeOutlinedIcon
                    sx={{
                      color: "#808080b8",
                    }}
                  />
                  <Divider orientation="vertical" />
                </Box>
                <Box
                  className="timer-value-section"
                  sx={{
                    // border: "1px solid black",
                    height: "100%",
                    width: "25%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "500",
                    fontSize: "19px",
                  }}
                >
                  {formatTime(time.hours)}:{formatTime(time.minutes)}:
                  {formatTime(time.seconds)}
                </Box>
                <Box
                  className="start-timer-section"
                  sx={{
                    // border: "1px solid black",
                    height: "100%",
                    width: "25%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      startTimer();
                      // console.log(startTime);
                      // console.log(endTime);
                      // console.log(totalTime);
                    }}
                    sx={{
                      backgroundColor: isRunning ? "#f53f3f" : "#03a9f4",

                      ":hover": {
                        backgroundColor: isRunning ? "#f53f3f" : "#03a9f4",
                      },
                    }}
                  >
                    {isRunning ? "Stop" : "Start"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            className="tracker-main-container-section-two"
            sx={{
              //   border: "1px solid black",
              width: "100%",
              height: "69vh",
            }}
          ></Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TimeTracker;
