import React, { useState, useRef, useEffect, Fragment } from "react";
import { Box, Button, Divider, Popover, Typography } from "@mui/material";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "../Loader/Loader";
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
  const [description, setDescription] = useState("");
  const [projectTitle, setProjectTitle] = useState("Project");
  const [flag, setFlag] = useState(true);
  const [formattedTotalTime, setFormattedTotalTime] = useState("");

  function convertMillisecondsToHMS(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  console.log(projectTitle);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:4003/api/v1/sessions");
      // console.log(data);

      const formattedTime = convertMillisecondsToHMS(data.sumOfTime);
      setFormattedTotalTime(formattedTime);

      // setMyData(data.groupedData);
      // setMyData(data.groupedData);
      setMyData(data.groupedDataTwo);

      if (data.sessions.length === 0) {
        setIsLoading(false);
      }

      setIsLoading(false);
      return data;
    } catch (err) {
      console.log("Error while fetching the data");
    }
  };

  const handleAddSession = async (t, s, e, g) => {
    try {
      var today = new Date();
      var dd = today.getDate();

      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      today = mm + "/" + dd + "/" + yyyy;

      const { data } = await axios.post(
        "http://localhost:4003/api/v1/session/new",
        {
          description: description,
          totalTime: t,
          startTime: s,
          endTime: e,
          date: today,
          grandTotal: g,
          project: projectTitle,
        }
      );

      const formattedTime = convertMillisecondsToHMS(data.sumOfTime);
      setFormattedTotalTime(formattedTime);

      setDescription("");
      // setMyData(data.groupedData);
      setMyData(data.groupedDataTwo);
    } catch (error) {
      console.log("hi");
      console.log(error.response.data);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4003/api/v1/session/${id}`
      );

      const formattedTime = convertMillisecondsToHMS(data.sumOfTime);
      setFormattedTotalTime(formattedTime);

      // setMyData(data.groupedData);
      setMyData(data.groupedDataTwo);

      setIsLoading(false);
    } catch (err) {
      console.log("Error in deleting the session!");
    }
  };

  let tt;
  let st;
  let et;
  let gt;
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
      let milliseconds = time.hours * 3600000;
      milliseconds = milliseconds + time.minutes * 60000;
      milliseconds = milliseconds + time.seconds * 1000;

      const x =
        formatTime(time.hours) +
        ":" +
        formatTime(time.minutes) +
        ":" +
        formatTime(time.seconds);

      tt = x;
      gt = milliseconds;

      // console.log(gt);
      setTotalTime(x);

      setTime({ seconds: 0, minutes: 0, hours: 0 });
    }

    const currentDate = new Date(Date.now());
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).format(currentDate);

    if (flag) {
      setStartTime(formattedDate);
      setStartTime(formattedDate);
      setFlag(!flag);
    } else {
      setEndTime(formattedDate);
      setFlag(!flag);
      et = formattedDate;
      st = startTime;

      handleAddSession(tt, st, et, gt);
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
  useEffect(() => {}, [
    endTime,
    startTime,
    totalTime,
    description,
    formattedTotalTime,
    projectTitle,
  ]);

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
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Box
            className="tracker-main-container-section-one"
            sx={{
              // border: "1px solid black",
              width: "100%",
              height: "21vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop:"2vh"
            }}
          >
            <Box
              className="tracker-main-container-section-one-timer-container"
              sx={{
                width: "95%",
                height: "8vh",
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
                  // border: "1px solid black",
                  width: "55%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="What are you working on ?"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
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
                  {/* <AddCircleOutlineIcon
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
                  </Typography> */}

                  <select
                    name="select-value"
                    id="select-project-title"
                    value={projectTitle}
                    onChange={(e) => {
                      setProjectTitle(e.target.value);
                    }}
                  >
                    <option value="Project 1">Project - 1</option>
                    <option value="Project 2">Project - 2</option>
                    <option value="Project 3">Project - 3</option>
                    <option value="Project 4">Project - 4</option>
                  </select>
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
              // border: "1px solid black",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              className="session-stats-container"
              sx={{
                border: "1px solid #C6D2D9",
                width: "95%",
                height: "10%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <span>Total time : </span> <p>{formattedTotalTime}</p>
            </Box>
            <Box
              className="all-session-holder-container"
              sx={{
                // border: "1px solid black",
                width: "95%",
                height: "90%",
              }}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {myData.map((day) => (
                    <Box
                      className="session-card"
                      sx={{
                        borderTop: "1px solid #C6D2D9",
                        borderBottom: "1px solid #C6D2D9",
                        width: "100%",
                        height: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        // marginBottom: "3vh",
                        marginTop: "2vh",
                      }}
                      key={day._id}
                    >
                      <Box
                        className="session-card-section-one"
                        sx={{
                          // border: "1px solid black",
                          width: "100%",
                          height: "6vh",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#e4eaee",
                          borderBottom: "1px solid #C6D2D9",
                        }}
                      >
                        <Typography
                          variant="span"
                          sx={{
                            color: "#999",
                            fontSize: "0.8rem",
                            marginLeft: "1.5vw",
                          }}
                        >
                          {day._id}
                        </Typography>
                        <Typography variant="span">
                          <Typography
                            variant="span"
                            sx={{
                              color: "#999",
                              fontSize: "0.8rem",
                              marginRight: "1vw",
                            }}
                          >
                            Daily total :{" "}
                          </Typography>

                          <Typography
                            variant="span"
                            sx={{
                              marginRight: "2vw",
                              fontWeight: "500",
                              fontSize: "1.1rem",
                            }}
                          >{`${Math.floor(day.grandTotal / (1000 * 60 * 60))
                            .toString()
                            .padStart(2, "0")}:${Math.floor(
                            (day.grandTotal / (1000 * 60)) % 60
                          )
                            .toString()
                            .padStart(2, "0")}:${Math.floor(
                            (day.grandTotal / 1000) % 60
                          )
                            .toString()
                            .padStart(2, "0")}`}</Typography>
                        </Typography>
                      </Box>

                      {day.projects.map((project) => (
                        <Fragment key={project.project}>
                          <Box
                            className="projects-header"
                            sx={{
                              // border: "1px solid black",
                              width: "100%",
                              height: "6vh",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="span"
                              sx={{
                                color: "#03a9f4",
                                fontWeight: "500",
                                fontSize: "0.8rem",
                                marginLeft: "1.5vw",
                              }}
                            >
                              {project.project}
                            </Typography>
                            <Typography variant="span">
                              <Typography
                                variant="span"
                                sx={{
                                  color: "#999",
                                  fontSize: "0.8rem",
                                  marginRight: "1vw",
                                }}
                              >
                                Project total :{" "}
                              </Typography>

                              <Typography
                                variant="span"
                                sx={{
                                  marginRight: "2vw",
                                  fontWeight: "500",
                                  fontSize: "1rem",
                                  color: "#999",
                                }}
                              >{`${Math.floor(
                                project.grandTotal / (1000 * 60 * 60)
                              )
                                .toString()
                                .padStart(2, "0")}:${Math.floor(
                                (project.grandTotal / (1000 * 60)) % 60
                              )
                                .toString()
                                .padStart(2, "0")}:${Math.floor(
                                (project.grandTotal / 1000) % 60
                              )
                                .toString()
                                .padStart(2, "0")}`}</Typography>
                            </Typography>
                          </Box>

                          {project.data.map((session) => (
                            <Box
                              className="session-card-section-two"
                              sx={{
                                // border: "1px solid red",
                                borderBottom: "1px solid #C6D2D9",
                                borderTop: "1px solid #C6D2D9",
                                width: "100%",
                                height: "6vh",
                                backgroundColor: "white",
                              }}
                              key={session._id}
                            >
                              <Box
                                className="tracker-main-container-section-one-timer-container"
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Box
                                  className="tracker-description2-container"
                                  sx={{
                                    // border: "1px solid red",
                                    width: "40%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={session.description}
                                    onChange={() => {}}
                                  />
                                </Box>
                                <Box
                                  className="tracker-options-container"
                                  sx={{
                                    // border: "1px solid blue",
                                    width: "60%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
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
                                    {/* <AddCircleOutlineIcon
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
                                      {project.project}
                                    </Typography> */}
                                  </Box>
                                  <Box
                                    className="tags-section"
                                    sx={{
                                      // border: "1px solid black",
                                      height: "100%",
                                      width: "38%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-around",
                                    }}
                                  >
                                    <Divider orientation="vertical" />

                                    {session.startTime}
                                    <Divider orientation="vertical" />

                                    {session.endTime}
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
                                    {session.totalTime}
                                  </Box>
                                  <Box
                                    className="start-timer-section"
                                    sx={{
                                      // border: "1px solid black",
                                      height: "100%",
                                      width: "10%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <DeleteIcon
                                      variant="contained"
                                      onClick={() => {
                                        handleDeleteSession(session._id);
                                      }}
                                      sx={{
                                        color: "#7b7b7b",
                                        fontSize: "20px",
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Fragment>
                      ))}
                    </Box>
                  ))}
                </>
                // <>
                //   {myData.map((day) => (
                //     <Box>
                //       {day._id}
                //       {day.projects.map((project) => (
                //         <Box>
                //           {project.project}
                //           <Box>
                //             {project.data.map((session) => (
                //               <Box>{session.startTime}</Box>
                //             ))}
                //           </Box>
                //         </Box>
                //       ))}
                //     </Box>
                //   ))}
                // </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TimeTracker;
