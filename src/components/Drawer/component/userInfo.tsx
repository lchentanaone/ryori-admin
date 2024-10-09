import React, { useEffect, useState } from "react";
import { Typography, TextField, Grid, Paper, Box } from "@mui/material";
import avatar from "./../../../../public/avatar1.png";
import Image from "next/image";
import styles from "../component/style/styles.module.css";
import Modal from "@mui/material/Modal";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

interface Data {
  _id: string;

  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

const UserInfo = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState<Data>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    username: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setUserData(responseData);
        console.log({ responseData });
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async () => {
    if (!userData.firstName) {
      setErrors("First Name is required.");
    } else if (!userData.lastName) {
      setErrors("Last Name is required.");
    } else if (!userData.username) {
      setErrors("Username is required.");
    } else {
      setErrors("");
      try {
        const userId = localStorage.getItem("user_Id");
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: userData.firstName,
              lastName: userData.lastName,
              username: userData.username,
              phone: userData.phone,
            }),
          }
        );
        if (response.ok) {
          fetchUserData();
          setIsEditing(false);
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateUserCred = async () => {
    if (!password || !confirmPassword) {
      setErrors("All fields are required.");
    } else if (password.length < 6) {
      setErrors("Password must be at least 6 characters.");
    } else if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
    } else {
      setErrors("");
      try {
        const token = localStorage.getItem("token");
        const user_Id = localStorage.getItem("user_Id");
        const store_Id = localStorage.getItem("store_Id");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${user_Id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              store_Id,
              password,
            }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log({ response });
        console.log({ password });
        if (response.ok) {
          fetchUserData();
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setOpen(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeText = (key: string | number, value: any) => {
    const tempUserData = {
      ...userData,
      [key]: value,
    };
    setUserData(tempUserData);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = () => {
    setIsEditing(false);
  };
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    // boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    fetchUserData();
    const existingToken = localStorage.getItem("token");

    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} style={{ padding: "20px", width: 800 }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{
            paddingLeft: 100,
            paddingRight: 100,
          }}
        >
          {userData ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" style={{ marginTop: 10 }}>
                Personal Detaits
              </Typography>
              <Grid item xs={12} textAlign="center">
                <Image src={avatar} alt="ryori" width={160} height={150} />
              </Grid>

              <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    value={userData.firstName}
                    fullWidth
                    required
                    disabled={!isEditing}
                    onChange={(e) => {
                      handleChangeText("firstName", e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    value={userData.lastName}
                    fullWidth
                    required
                    disabled={!isEditing}
                    onChange={(e) => {
                      handleChangeText("lastName", e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    variant="outlined"
                    value={userData.username}
                    fullWidth
                    required
                    disabled={!isEditing}
                    onChange={(e) => {
                      handleChangeText("username", e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={userData.email}
                    type="email"
                    required
                    disabled={true}
                    onChange={(e) => {
                      handleChangeText("email", e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contact No."
                    variant="outlined"
                    value={userData.phone}
                    fullWidth
                    required
                    disabled={!isEditing}
                    onChange={(e) => {
                      handleChangeText("phone", e.target.value);
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={userData.address}
                    rows={2}
                    required
                    disabled={!isEditing}
                    onChange={(e) => {
                      handleChangeText("address", e.target.value);
                    }}
                  />
                </Grid> */}
              </Grid>

              <Grid item xs={12} textAlign="center">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {errors !== "" && (
                    <div style={{ color: "#ff0000", top: -7 }}>{errors}</div>
                  )}
                  <button
                    onClick={isEditing ? updateUser : handleEditClick}
                    className={
                      isEditing ? `${styles.blue}` : `${styles.save_info}`
                    }
                    style={{ marginTop: 10 }}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
              </Grid>
            </div>
          ) : (
            <div>Loading</div>
          )}
          {!isEditing && (
            <button
              onClick={handleOpen}
              className={`${styles.save_info}`}
              style={{ marginTop: 10 }}
            >
              Change Password
            </button>
          )}
        </Grid>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h1>Change Password</h1>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              value={password}
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {errors !== "" && (
              <div style={{ color: "#ff0000", top: -7 }}>{errors}</div>
            )}
            <button
              onClick={updateUserCred}
              className={`${styles.save_info}`}
              style={{ marginTop: 10 }}
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>
    </Grid>
  );
};

export default UserInfo;
