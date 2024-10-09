import React, { useEffect, useState, useRef } from "react";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";
import styles from "./../Drawer/component/style/styles.module.css";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Data {
  storeName: string;
  branchName: string;
  email: string;
  address: string;
  contactNumber: string;
  photo: string;
  username?: string;
  _id?: string;
  fee?: number;
  serviceChargesToCustomer?: boolean;
  processType: string;
}

const StoreInfo: React.FC = () => {
  const [storeData, setStoreData] = useState<Data>({
    _id: "",
    storeName: "",
    branchName: "",
    username: "",
    email: "",
    address: "",
    contactNumber: "",
    photo: "",
    processType: "",
  });

  const [photo, setPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [chargedToCustomer, setChargedToCustomer] = useState(false);
  const [isSolanaVerify, setIsSolanaVerify] = useState(true);

  const toggleSwitch = () => {
    setChargedToCustomer((prevChecked) => {
      const newChecked = !prevChecked;
      return newChecked;
    });
  };
  const toggleSwitch2 = () => {
    setIsSolanaVerify((prevChecked) => {
      const newChecked = !prevChecked;
      return newChecked;
    });
  };

  const fetchStoreData = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      const store_Id = localStorage.getItem("store_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/${store_Id}/${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setStoreData({
          storeName: responseData.storeName,
          photo: responseData.photo,
          processType: responseData.processType,
          contactNumber: responseData.branch.contactNumber,
          branchName: responseData.branch.branchName,
          email: responseData.branch.email,
          address: responseData.branch.address,
          fee: responseData.fee || 0,
          serviceChargesToCustomer:
            responseData.branch.serviceChargesToCustomer,
        });

        setPhoto(responseData.photo);
        setChargedToCustomer(responseData.branch.serviceChargesToCustomer);
        setIsSolanaVerify(responseData.isSolanaVerify);
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");
      const branch_Id = localStorage.getItem("branch_Id");

      var formdata = new FormData();
      formdata.append("storeName", storeData.storeName);
      if (typeof storeData.photo !== "string") {
        formdata.append("photo", storeData.photo || "");
      }
      formdata.append("processType", storeData.processType);

      formdata.append("branch_Id", branch_Id || "");
      formdata.append("branchName", storeData.branchName);
      formdata.append("contactNumber", storeData.contactNumber);
      formdata.append("email", storeData.email);
      formdata.append("address", storeData.address);
      formdata.append("serviceChargesToCustomer", chargedToCustomer.toString());
      formdata.append("isSolanaVerify", isSolanaVerify.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/${store_Id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdata,
        }
      );
      if (response.ok) {
        fetchStoreData();
      } else {
        console.error("Failed to add item.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChangeText = (key: string | number, value: any) => {
    const tempUserData = {
      ...storeData,
      [key]: value,
    };
    setStoreData(tempUserData);
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    handleChangeText("photo", selectedFile);
  };

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = () => {
    setIsEditing(false);
    handleSubmit();
  };

  useEffect(() => {
    fetchStoreData();
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} style={{ padding: "20px", width: 800 }}>
        {storeData ? (
          <>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" style={{ marginTop: 10 }}>
                  {isEditing ? "Update Store" : "Store Details"}
                </Typography>
                <div>
                  {photo && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={
                          typeof storeData.photo === "string"
                            ? storeData.photo
                            : URL.createObjectURL(storeData.photo)
                        }
                        alt="Selected"
                        width="170"
                        height="150"
                        style={{ borderRadius: 10 }}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {isEditing && (
                    <button
                      className={styles.uploadImg_menu}
                      onClick={handleUpload}
                    >
                      Upload Image
                    </button>
                  )}
                </div>
              </div>
              <div>
                <Grid container spacing={2} style={{ marginTop: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Store Name"
                      variant="outlined"
                      value={storeData.storeName}
                      fullWidth
                      required
                      disabled={!isEditing}
                      name="storeName"
                      onChange={(e) => {
                        handleChangeText("storeName", e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Branch"
                      variant="outlined"
                      value={storeData.branchName}
                      fullWidth
                      required
                      disabled={!isEditing}
                      onChange={(e) => {
                        handleChangeText("branchName", e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contact No."
                      variant="outlined"
                      fullWidth
                      value={storeData.contactNumber}
                      type="email"
                      required
                      disabled={!isEditing}
                      onChange={(e) => {
                        handleChangeText("contactNumber", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      value={storeData.email}
                      fullWidth
                      required
                      disabled={!isEditing}
                      onChange={(e) => {
                        handleChangeText("email", e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      variant="outlined"
                      fullWidth
                      multiline
                      value={storeData.address}
                      rows={2}
                      required
                      disabled={!isEditing}
                      onChange={(e) => {
                        handleChangeText("address", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div className={styles.chargeContainer}>
                      <div
                        className={
                          isEditing ? `${styles.notAcive}` : `${styles.active}`
                        }
                      >
                        Charge To Customer
                      </div>
                      <div>
                        <Switch
                          disabled={!isEditing}
                          checked={chargedToCustomer}
                          onChange={toggleSwitch}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Process Type</InputLabel>
                      <Select
                        value={storeData.processType}
                        label="Process Type"
                        onChange={(e) => {
                          handleChangeText("processType", e.target.value);
                        }}
                      >
                        <MenuItem value={"serveToPay"}>Serve To Pay</MenuItem>
                        <MenuItem value={"payToServe"}>Pay To Serve</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div className={styles.chargeContainer}>
                      <div
                        className={
                          isEditing ? `${styles.notAcive}` : `${styles.active}`
                        }
                      >
                        Solana
                      </div>
                      <div>
                        <Switch
                          disabled={!isEditing}
                          checked={isSolanaVerify}
                          onChange={toggleSwitch2}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Fee"
                      variant="filled"
                      fullWidth
                      value={["₱", storeData.fee].join(" ")}
                      rows={2}
                      disabled={true}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={isEditing ? handleUpdateClick : handleEditClick}
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
            </Grid>
          </>
        ) : (
          <div>Loading</div>
        )}
      </Paper>
    </Grid>
  );
};

export default StoreInfo;
