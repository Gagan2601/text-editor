import "./App.css";
import Navbar from "./components/Navbar";
import About from "./components/About";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Alert from "./components/Alert";
import Textform from "./components/Textform";

function App() {
  const [mode, setMode] = useState("light");
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  const darkmode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "#042743";
      showAlert("Dark mode has been enabled", "success");
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
      showAlert("Light mode has been enabled", "success");
    }
  };
  return (
    <>
      <Router>
        <Navbar title="TextEditor" mode={mode} darkmode={darkmode} />
        <Alert alert={alert} />
        {/* <Navbar/> */}
        <div className="container my-3">
          {/* <About/> */}

          <Routes>
            <Route path="/about" element={<About mode={mode} />}></Route>
            <Route
              path="/"
              element={
                <Textform
                  showAlert={showAlert}
                  heading="Enter text to analyse below"
                  mode={mode}
                />
                // <TextEditor />
              }
            ></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
