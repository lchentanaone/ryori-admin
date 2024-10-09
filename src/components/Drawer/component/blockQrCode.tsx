import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { truncateText } from "@/utils/utils";
import styles from "../component/style/styles.module.css";

interface BlockQrCode {
  blockQrCode: string;
}
const BlockQrCode = () => {
  const [error, setError] = useState("");
  const [blockQrCode, setBlockQrCode] = useState("");
  const [url, setUrl] = useState<BlockQrCode[]>([]);

  const fetchBlockQr = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch/${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUrl(data.blockQrCode);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlockQrCode = async () => {
    if (!blockQrCode) {
      setError("URL is required");
    } else {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const branch_Id = localStorage.getItem("branch_Id");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/branch/${branch_Id}/blockQr`,
          {
            method: "POST",
            body: JSON.stringify({
              blockQrCode,
            }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          fetchBlockQr();
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        setBlockQrCode("");
        setError("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUnblock = async (index: any) => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch/${branch_Id}/unblockQr/${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      fetchBlockQr();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlockQr();
  }, []);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      marginTop={1}
      flexDirection="column"
    >
      <div>
        <TextField
          label="URL"
          variant="outlined"
          value={blockQrCode}
          size="small"
          style={{ width: 625, marginRight: 15 }}
          required
          onChange={(e) => setBlockQrCode(e.target.value)}
        />
        <button
          onClick={handleBlockQrCode}
          className={`${styles.primary_color_btn} ${styles.generateQr_btn}`}
          style={{ marginTop: 2 }}
        >
          Block
        </button>
        {error !== "" && <div className="error_message">{error}</div>}
      </div>
      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ marginTop: 10 }}>
          <Table sx={{ maxHeight: 300, width: "830px" }} size="small">
            <TableHead>
              <TableRow style={{ justifyContent: "space-between" }}>
                <TableCell style={{ width: "800px" }} className="trans_header">
                  URL
                </TableCell>
                <TableCell className="trans_header">Unblock</TableCell>
              </TableRow>
            </TableHead>
            {url.map((blockQrCode, index) => (
              <TableBody key={index}>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      borderBottom: 1,
                      borderColor: "gray",
                    },
                  }}
                >
                  <TableCell style={{ width: "10px" }} className="trans_cell">
                    {truncateText(blockQrCode.toString(), 115)}
                  </TableCell>
                  <TableCell className="trans_cell">
                    <button
                      className="unblock"
                      onClick={() => handleUnblock(index)}
                      style={{ color: "#db1b1b" }}
                    >
                      Unblock
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
export default BlockQrCode;
