import React from "react";
import "./Loader.css";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <CircularProgress/>
    </Box>
  );
}

export default Loader;
