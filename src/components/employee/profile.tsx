import { useState, useEffect } from "react";
import { Typography, TextField, Grid, Paper, Box } from "@mui/material";
import Image from "next/image";
import avatar from "../../../public/avatar1.png";
import styles from "./styles.module.css";

interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
}

export default function Profile() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [userData, setUserData] = useState<UserData>();

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
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    mounted && (
      <div>
        <Grid container justifyContent="center" height="100vh">
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              height: "75vh",
              width: 500,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">My Profile</Typography>
            <Grid item xs={12} textAlign="center">
              <Image src={avatar} alt="ryori" width={130} height={130} />
            </Grid>
            {userData ? (
              <>
                <h5>{userData.username}</h5>
                <h5>{userData.email}</h5>
              </>
            ) : (
              <h5>Loading user data...</h5>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                paddingLeft: "50px",
                paddingRight: "50px",
                marginTop: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div className={styles.profileText}>First Name</div>
                <div className={styles.profileText}>Last Name</div>
                <div className={styles.profileText}>Position</div>
                <div className={styles.profileText}>Contact no.</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: 100,
                }}
              >
                {userData ? (
                  <>
                    <div className={styles.profileText}>
                      {userData.firstName}
                    </div>
                    <div className={styles.profileText}>
                      {userData.lastName}
                    </div>
                    <div className={styles.profileText}>{userData.role}</div>
                    <div className={styles.profileText}>{userData.phone}</div>
                  </>
                ) : (
                  <h5>Loading user data...</h5>
                )}
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </Paper>
        </Grid>
      </div>
    )
  );
}
