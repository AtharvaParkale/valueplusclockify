import React from "react";
import "./Loader.css";
import { Box } from "@mui/material";

function Loader() {
  return (
    <Box
      sx={{
        // border: "2px solid black",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box className="loader"></Box>
      <Box sx={{ marginTop: "6vh", fontWeight: "500" }}>Loading</Box>
    </Box>
  );
}

export default Loader;
