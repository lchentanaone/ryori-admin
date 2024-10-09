import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Typography,
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
interface Categories {
  _id: string;
  title: string;
  photo: string;
}

const MenuCategories = () => {
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [itemOnEdit, setItemOnEdit] = useState<Categories>({
    _id: "-1",
    title: "",
    photo: "",
  });
  const [category, setCategory] = useState<Categories[]>([]);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = await localStorage.getItem("token");
        const store_Id = await localStorage.getItem("store_Id");
        const branch_Id = await localStorage.getItem("branch_Id");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menuItem?store_Id=${store_Id}&branch_Id=${branch_Id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        const allMenuCategories: any[] = [];
        if (Array.isArray(responseData)) {
          responseData.forEach((item: any) => {
            if (item.menuCategories && Array.isArray(item.menuCategories)) {
              allMenuCategories.push(...item.menuCategories);
            }
          });
        }

        setMenus(allMenuCategories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMenus();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menuCategory?store_Id=${store_Id}`,
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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");

      const formdata = new FormData();
      formdata.append("title", itemOnEdit.title);
      formdata.append("store_Id", store_Id || "");
      if (typeof itemOnEdit.photo !== "string") {
        formdata.append("photo", itemOnEdit.photo || "");
      }
      if (itemOnEdit._id !== "-1") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menuCategory/${itemOnEdit._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formdata,
          }
        );
        if (response.ok) {
          fetchItems();
        } else {
          console.error("Failed to add item.");
        }
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menuCategory/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formdata,
          }
        );
        if (response.ok) {
          fetchItems();
        } else {
          console.error("Failed to add item.");
        }
      }
      setItemOnEdit({
        _id: "-1",
        title: "",
        photo: "",
      });

      setTitle("");
      setPhoto(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const shouldRenderDelete = (_id: string) => menus.includes(_id);
  const CannotDelete = async (item: any) => {
    const swalResponse = await Swal.fire({
      title: "Cannot Delete!",
      text: "Because this category has a menu.",
      icon: "error",
      cancelButtonText: "OK",
    });
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
        `${process.env.NEXT_PUBLIC_API_URL}/menuCategory/${_id}`,
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
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleEdit = (item: any) => {
    setItemOnEdit(item);
  };

  const handleChangeText = (key: string | number, value: any) => {
    const tempData = {
      ...itemOnEdit,
      [key]: value,
    };
    setItemOnEdit(tempData);
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    handleChangeText("photo", selectedFile);
  };

  useEffect(() => {
    fetchItems();
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "20px", height: "90vh" }}>
      <Typography variant="subtitle1">Menu Categories</Typography>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          paddingLeft: 40,
          paddingRight: 40,
          height: 200,
        }}
      >
        <div
          style={{
            flexDirection: "column",
            display: "flex",
          }}
        >
          <TextField
            label="Category Name"
            variant="outlined"
            margin="normal"
            value={itemOnEdit?.title}
            style={{ width: 300 }}
            onChange={(e) => handleChangeText("title", e.target.value)}
            size="small"
          />

          <button
            className={`${styles.uploadImg_menu} ${styles.top}`}
            onClick={handleUpload}
          >
            Upload Image
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            onClick={handleSubmit}
            className={`${styles._button} ${styles.add_employee}`}
          >
            Save
          </button>
        </div>
        <div className={styles.image}>
          <div>
            {itemOnEdit.photo && (
              <div>
                <img
                  src={
                    typeof itemOnEdit.photo === "string"
                      ? itemOnEdit.photo
                      : URL.createObjectURL(itemOnEdit.photo)
                  }
                  alt="Selected"
                  width="190"
                  height="150"
                  style={{ borderRadius: 10 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxHeight: "380px", overflowY: "auto" }}>
        <TableContainer style={{ flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {category.map((item, index) => (
              <TableBody key={index}>
                <TableRow>
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
                      onClick={() =>
                        shouldRenderDelete(item._id)
                          ? CannotDelete(item._id)
                          : deleteConfirm(item._id)
                      }
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

export default MenuCategories;
