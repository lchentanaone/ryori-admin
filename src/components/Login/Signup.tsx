"use client";

import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";
import ryori from "./../../../public/ryoriLogo.png";
import Image from "next/image";
import style from "./style.module.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TearmsAndCondtions from "@/utils/tearmsAndCondtions";
import termsStyle from "./../../styles/terms.module.css";

const SignupForm: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAdress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const toggleCheckbox = () => {
    setIsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      return newChecked;
    });
  };

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  const handleRegister = async () => {
    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !confirmPassword
    ) {
      setError("All fields are required.");
    } else if (!isValidEmail(email)) {
      setError("Invalid email format.");
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else if (!isChecked) {
      setError("You must agree the Tearms and Conditions.");
    } else {
      setError("");
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              username,
              email,
              password,
              phoneNumber,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          const token = data.access_token;
          localStorage.setItem("token", token);
          window.location.href = "/admin/createStore";
        } else {
          if (response.status === 409) {
            setError("Email already exists.");
          } else if (response.status === 400) {
            setError("Invalid request data.");
          } else {
            setError("Invalid Registration");
          }
        }
      } catch (error: any) {
        console.error("Error registering:", error);
        setError("An error occurred while registering.");
      } finally {
        setLoading(false);
      }
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };
  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <Grid item xs={12} sm={8}>
          <Paper elevation={3} style={{ padding: "80px" }}>
            <div
              style={{
                justifyContent: "center",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              <Image src={ryori} alt="ryori" width={300} height={100} />
            </div>
            <Typography variant="subtitle1">
              Please sign up to Continue
            </Typography>
            <div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  name="firstName"
                  value={firstName}
                  required
                  margin="normal"
                  onChange={(e) => setFirstname(e.target.value)}
                  style={{ marginRight: "20px" }}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  margin="normal"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  margin="normal"
                  style={{ marginRight: "20px" }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  margin="normal"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  margin="normal"
                  style={{ marginRight: "20px" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <Visibility style={{ color: "#DB1B1B" }} />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <Visibility style={{ color: "#DB1B1B" }} />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  margin="normal"
                  style={{ marginRight: "20px", width: "50%" }}
                />
                <div className={termsStyle.checkboxContainer}>
                  <Checkbox checked={isChecked} onChange={toggleCheckbox} />
                  <h5
                    onClick={handleOpenTerms}
                    className={termsStyle.termsText}
                  >
                    Terms and Conditions
                  </h5>
                </div>
              </div>
              {error && <div className="error_message">{error}</div>}
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <button
                  className={style.signup_btn}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={25} thickness={6} />
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={openTerms}
        onClose={handleCloseTerms}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className={termsStyle.title}>
          Terms and Conditions
        </DialogTitle>
        <DialogContent>
          <TearmsAndCondtions />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerms}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignupForm;
