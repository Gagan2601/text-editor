import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function Navbar(props) {
  return (
    <div>
      <nav
        className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            {props.title}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  {props.abouttext}
                </Link>
              </li>
            </ul>
            <div className="d-flex">
              <div className="form-check form-switch">
                <label
                  htmlFor="dark-mode"
                  className={`form-check-label ${
                    props.mode === "dark" ? "text-white" : ""
                  }`}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {props.mode === "dark" ? (
                      <FontAwesomeIcon
                        icon={faMoon}
                        style={{ fontSize: "25px", marginRight: 5 }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faSun}
                        style={{ fontSize: "25px", marginRight: 5 }}
                      />
                    )}
                  </div>
                </label>
                <input
                  id="dark-mode"
                  className="toggle"
                  type="checkbox"
                  onClick={() => {
                    props.darkmode();
                  }}
                  name="Dark mode"
                  role="switch"
                  value="on"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  abouttext: PropTypes.string,
};

Navbar.defaultProps = {
  title: "Title here",
  abouttext: "About",
};
