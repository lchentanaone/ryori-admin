import React, { useState, useRef, useEffect } from "react";
import { TextField, Grid, Paper, Typography } from "@mui/material";
import style from "./style.module.css";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";

const CreateStore: React.FC = () => {
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const [photo, setPhoto] = useState("");
  const [storeName, setStoreName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [storeData, setStoreData] = useState({
    storeName: "",
    branchName: "",
    email: "",
    address: "",
    contactNumber: "",
    photo: "",
  });

  const handleAddStoreWithBranch = async () => {
    const token = await localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("storeName", storeData.storeName);
      formData.append("photo", storeData.photo);
      formData.append("branchName", storeData.branchName);
      formData.append("email", storeData.email);
      formData.append("contactNumber", storeData.contactNumber);
      formData.append("address", storeData.address);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
        method: "POST",
        headers: headers,
        body: formData,
      });
      const data = await response.json();
      await localStorage.setItem("store_Id", data._id.toString());
      await localStorage.setItem("branch_Id", data.branches[0]._id);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSave = async () => {
    if (!storeData.photo || !storeData.storeName || !storeData.branchName) {
      setErrors("Logo, Store, and Branch name must be provided");
    } else {
      setErrors("");
      // if (type === 'branch') {
      //   await handleAddBranch();
      // } else {
      await handleAddStoreWithBranch();
      // }
      window.location.href = "/admin/dashboard";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setStoreData((prevData) => ({
      ...prevData,
      photo: selectedFile,
    }));
  };
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
    console.log({ token });
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" style={{ marginBottom: 20 }}>
              Set up your Store
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              {storeData.photo && (
                <div style={{ marginTop: 10 }}>
                  <Image
                    className={style.avatar}
                    src={
                      typeof storeData.photo === "string"
                        ? storeData.photo
                        : URL.createObjectURL(storeData.photo)
                    }
                    alt="Selected"
                    width="170"
                    height="200"
                    style={{ borderRadius: 10 }}
                  />
                </div>
              )}
              <button className={style.uploadImg_menu} onClick={handleUpload}>
                Upload Image
              </button>
              <input
                type="file"
                ref={hiddenFileInput}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <TextField
            label="Store Name"
            variant="outlined"
            fullWidth
            value={storeData.storeName}
            name="storeName"
            onChange={handleChange}
            required
            margin="normal"
            style={{ marginRight: "10px" }}
          />

          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              label="Branch Name"
              variant="outlined"
              fullWidth
              value={storeData.branchName}
              name="branchName"
              onChange={handleChange}
              required
              margin="normal"
              style={{ marginRight: "10px" }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={storeData.email}
              name="email"
              onChange={handleChange}
              required
              type="email"
              margin="normal"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              name="address"
              value={storeData.address}
              onChange={handleChange}
              required
              margin="normal"
              style={{ marginRight: "10px" }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={storeData.contactNumber}
              name="contactNumber"
              onChange={handleChange}
              required
              margin="normal"
            />
          </div>

          <button
            className="button-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={25} thickness={6} /> : "Save"}
          </button>
          {errors !== "" && (
            <p style={{ color: "#ff0000", top: -7 }}>{errors}</p>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateStore;
