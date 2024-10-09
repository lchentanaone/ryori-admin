import React, { useState, useRef, useEffect } from "react";

import {
  TextField,
  Typography,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "../component/style/styles.module.css";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";

interface Data {
  _id: string;
  title: string;
  categories?: any[];
}

const RawCategories: React.FC = () => {
  const [title, setTitle] = useState("");
  const [itemOnEdit, setItemOnEdit] = useState("");
  const [errors, setErrors] = useState([]);
  const [category, setCategory] = useState<Data[]>([]);

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/rawcategory?branch_Id=${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      setCategory(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const addCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");

      if (itemOnEdit) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/inventory/rawcategory/${itemOnEdit}`,
          {
            method: "PATCH",
            body: JSON.stringify({ title, branch_Id }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          fetchCategory();
          setTitle("");
          setItemOnEdit("");
          const responseData = await response.json();
          if (Array.isArray(responseData)) {
            fetchCategory();
            setCategory(responseData);
          }
        } else {
          console.error("Failed to add category");
        }
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/inventory/rawcategory/`,
          {
            method: "POST",
            body: JSON.stringify({ title, branch_Id }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          fetchCategory();
          setTitle("");
          const responseData = await response.json();
          if (Array.isArray(responseData)) {
            fetchCategory();
            setCategory(responseData);
          }
        } else {
          console.error("Failed to add category");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (item: any) => {
    setItemOnEdit(item._id);
    setTitle(item.title);
  };

  const deleteConfirm = async (_id: string) => {
    const swalResponse = await Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });
    if (swalResponse.isConfirmed) {
      deleteItem(_id);
    }
  };

  const deleteItem = async (_id: string) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/rawcategory/${_id}`,
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
      fetchCategory();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategory();

    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "20px", height: "90vh" }}>
      <Typography variant="subtitle1">Inventory Categories</Typography>
      <TextField
        label="Category Name"
        variant="outlined"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: 300 }}
        size="small"
      />
      <Grid item xs={12} md={6}>
        <button
          onClick={addCategory}
          className={`${styles._button} ${styles.add_employee}`}
          style={{ width: 300 }}
        >
          Save
        </button>
      </Grid>
      <div style={{ maxHeight: "380px", overflowY: "auto", marginTop: 80 }}>
        <TableContainer style={{ flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>No.</TableCell> */}
                <TableCell>Category Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {category.map((item, index) => (
              <TableBody>
                <TableRow key={index}>
                  <TableCell style={{ fontSize: "12px" }}>
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      aria-label="pencil"
                    >
                      <BorderColorIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteConfirm(item._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
};

export default RawCategories;
