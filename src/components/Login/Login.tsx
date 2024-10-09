import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Link from "next/link";
import { Grid } from "@mui/material";
import Image from "next/image";
import ryori from "./../../../public/ryoriLogo.png";
import ryoriIcon from "./../../../public/logo.png";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async (socket: any) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const jsonData = await response.json();
        const role = jsonData.role;
        const token = jsonData.access_token;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user_Id", jsonData.user_Id);
        localStorage.setItem("service_fee", jsonData.fee);
        localStorage.setItem("threshold", jsonData.threshold);
        localStorage.setItem("processType", jsonData.processType);

        if (jsonData.isDeactivated === true) {
          localStorage.clear();
          setIsDeactivated(true);
          setPassword("");
          return;
        }

        if (jsonData.store_Id) {
          await localStorage.setItem("store_Id", jsonData.store_Id.toString());
        }
        if (jsonData.branch_Id) {
          await localStorage.setItem(
            "branch_Id",
            jsonData.branch_Id.toString()
          );
        }
        if (role === "admin") {
          if (!jsonData.store_Id) {
            window.location.href = "/admin/createStore";
            return;
          } else {
            window.location.href = "/admin/selectBranch";
          }
        } else if (role === "manager") {
          window.location.href = "/employee/manager";
        } else if (role === "kitchen") {
          window.location.href = "/employee/kitchenStaff";
        } else if (role === "dining") {
          window.location.href = "/employee/diningStaff";
        }
      } else {
        setError("Invalid access token");
        console.log({ error });
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // else  if (jsonData.store_Id) {
  //   window.location.href = "/admin/selectBranch";
  // } else {
  //   window.location.href = "/admin/createStore";
  // }

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (existingToken) {
      if (role === "admin") {
        window.location.href = "/admin/selectBranch";
      } else if (role === "manager") {
        window.location.href = "/employee/manager";
      } else if (role === "kitchen") {
        window.location.href = "/employee/kitchenStaff";
      } else if (role === "dining") {
        window.location.href = "/employee/diningStaff";
      }
    }
  }, []);

  const backgroundStyle = {
    backgroundImage: `url('/backgroundIMG.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  return (
    <div style={backgroundStyle}>
      {isDeactivated && (
        <Stack
          sx={{
            position: "fixed",
            top: 2,
            zIndex: 9999,
          }}
          spacing={0.5}
        >
          <Alert severity="error">
            <AlertTitle>Account Expired</AlertTitle>
            Your account has expired. If you would like to renew, please contact
            the system administrator.
          </Alert>
        </Stack>
      )}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{
          // height: "100vh",
          flexDirection: "row",
          justifyContent: "space-around",
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        <Grid>
          <div
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <p className={style.hello}>Hello,</p>
              <p className={style.welcome}>Welcome to Ryori</p>
              <p className={style.ultimate}>your ultimate business partner</p>
            </div>
            <div style={{ marginTop: 20 }}>
              <Image src={ryoriIcon} alt="ryori" width={200} height={200} />
            </div>
          </div>
        </Grid>
        <Grid>
          <div style={{ paddingTop: 60 }}>
            <div className={style.shadow}>
              <div style={{ textAlign: "center" }}>
                <Image src={ryori} alt="ryori" width={160} height={65} />
              </div>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <div className={style.loginText}>
                  Please Sign-In To Continue
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <div className={style.form_group}>
                  <label className={style.label}>
                    Enter your Email address:
                  </label>
                  <OutlinedInput
                    type={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{
                      style: {
                        textAlign: "center",
                        fontFamily: "Quicksand",
                        fontWeight: 600,
                      },
                    }}
                    size="small"
                  />
                </div>
                <div className={style.form_group}>
                  <label className={style.label}>Enter your Password:</label>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    inputProps={{
                      style: {
                        textAlign: "center",
                        fontFamily: "Quicksand",
                        fontWeight: 600,
                      },
                    }}
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
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
                    }
                  />
                </div>
                {error && <div className="error_message">{error}</div>}
                <div className={style.gap}>
                  <button
                    className={style.button}
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Sign in"}
                  </button>
                </div>
                <div className={style.gap}>
                  <Link href="/admin/signup" prefetch={false}>
                    <button className={style.button}>Create Account</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginForm;
