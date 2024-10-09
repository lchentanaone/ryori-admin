import React, { useEffect, useState } from "react";
import { Typography, TextField, Grid, Paper } from "@mui/material";

import styles from "../component/style/styles.module.css";

import BlockQrCode from "./blockQrCode";

const QRGenerator = () => {
  const [table, setTable] = useState("");
  const [qrString, setQrString] = useState<string>("");
  const [error, setError] = useState("");

  const handleGenerateQrCode = async () => {
    if (!table) {
      setError("Table number is required");
    } else {
      const store_Id = localStorage.getItem("store_Id");
      const branch_Id = localStorage.getItem("branch_Id");
      const originalStr = `id=${store_Id}&branch=${branch_Id}&table=${table}`;

      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/encrypt/${originalStr}`
      );
      const encryptedStr = await request.text();
      const strToQr = `${process.env.NEXT_PUBLIC_RYORI_WEB_APP}?token=${encryptedStr}`;
      console.log({ originalStr, encryptedStr, strToQr });
      setQrString(strToQr);
      setError("");
    }
  };
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    p: 4,
  };
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <Grid container justifyContent="center" alignItems="center" padding={2}>
      <Grid container alignItems="center" justifyContent="center">
        <Typography variant="h6">Generate Table QR Code here</Typography>
        <Grid item xs={12} textAlign="center">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {qrString && (
              // old https://chart.apis.google.com/chart?cht=qr&chs=248&chl=
              <img
                width={250}
                height={250}
                alt="QR Code"
                src={`https://api.qrserver.com/v1/create-qr-code?data=${qrString}`}
              />
            )}
            <TextField
              label="Table No."
              variant="outlined"
              value={table}
              // fullWidth
              size="small"
              required
              type="number"
              style={{ marginTop: 15 }}
              onChange={(e) => setTable(e.target.value)}
            />
            {error !== "" && <div className="error_message">{error}</div>}
            <button
              onClick={handleGenerateQrCode}
              className={`${styles.primary_color_btn} ${styles.generateQr_btn}`}
              style={{ marginTop: 5 }}
            >
              Generate
            </button>
          </div>
        </Grid>

        <Grid item xs={12}>
          <BlockQrCode />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QRGenerator;
