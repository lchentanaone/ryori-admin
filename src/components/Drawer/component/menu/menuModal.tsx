import React, { useState, useRef, useEffect } from "react";
import { TextField } from "@mui/material";
import styles from "../../component/style/styles.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Styles from "./style.module.css";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const MenuModal: React.FC<MenuModalProps> = ({
  open,
  selectedMenu,
  setSelectedMenu,
  setOpen,
  fetchMenu,
}) => {
  const [errors, setErrors] = useState("");
  const [categories, setCategories] = useState<iCategoryDOM[]>();
  const [transaction, setTransaction] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [addOnTitle, setAddOnTitle] = useState("");
  const [addOnPrice, setAddOnPrice] = useState("");

  const [varietyTitle, setVarietyTitle] = useState("");
  const [varietyPrice, setVarietyPrice] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSelectedMenu({ _id: "-1" });
    setErrors("");
  };
  const handleChangeText = (key: string | number, value: any) => {
    const tempData = {
      ...selectedMenu,
      [key]: value,
    };
    setSelectedMenu(tempData);
  };

  const handleDropdownChange = (event: SelectChangeEvent) => {
    const tmpSelectedMenu = { ...selectedMenu };
    tmpSelectedMenu.menuCategories = [event.target.value];
    setSelectedMenu(tmpSelectedMenu);
  };

  const fetchCategory = async () => {
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
      const _categories = await response.json();
      const dropdownCategories = _categories.map((item: iCategory) => ({
        label: item.title,
        value: item._id,
      }));

      setCategories(dropdownCategories);
    } catch (error) {
      console.error(error);
    }
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

  const CannotDelete = async (item: any) => {
    handleClose();
    const swalResponse = await Swal.fire({
      title: "Cannot Delete!",
      text: "Because there are transactions that are not complete.",
      icon: "error",
      cancelButtonText: "OK",
    });
  };

  const deleteItem = async (_id: string) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menuItem/${_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      } else {
        fetchMenu();
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (item: MenuData) => {
    handleClose();
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
      deleteItem(item._id);
    }
  };

  const handleAddMenu = async () => {
    return new Promise(async (resolve, reject) => {
      if (!selectedMenu?.title) {
        setErrors("Title is required.");
      } else if (!selectedMenu?.description) {
        setErrors("Description is required.");
      } else if (!selectedMenu?.quantity) {
        setErrors("quantity is required.");
      } else if (!selectedMenu?.cookingTime) {
        setErrors("cookingTime is required.");
      } else if (!selectedMenu?.price) {
        setErrors("Price is required.");
      } else if (!selectedMenu?.menuCategories) {
        setErrors("Category is required.");
      } else if (!selectedMenu?.photo) {
        setErrors("Photo is required.");
      } else {
        setErrors("");

        try {
          const token = localStorage.getItem("token");
          const store_Id = localStorage.getItem("store_Id") || "";
          const branch_Id = localStorage.getItem("branch_Id") || "";

          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const formData = new FormData();
          formData.append("title", selectedMenu.title);
          formData.append("price", selectedMenu.price);
          formData.append("description", selectedMenu.description);
          formData.append("qty", selectedMenu.quantity);
          formData.append("cookingTime", selectedMenu.cookingTime);
          formData.append("menuCategory_Id", selectedMenu.menuCategories[0]);
          formData.append("branch_Id", branch_Id);
          formData.append("store_Id", store_Id);
          if (typeof selectedMenu.photo !== "string") {
            formData.append("photo", selectedMenu.photo || "");
          }

          if (selectedMenu.addOns && selectedMenu.addOns?.length > 0) {
            selectedMenu.addOns?.forEach((addOn, index) => {
              formData.append(`addOns[${index}][title]`, addOn.title);
              formData.append(
                `addOns[${index}][price]`,
                addOn.price.toString()
              );
            });
          } else {
            formData.append("addOns", "--empty--");
          }

          if (selectedMenu.varieties && selectedMenu.varieties?.length > 0) {
            selectedMenu.varieties?.forEach((variety, index) => {
              formData.append(`varieties[${index}][title]`, variety.title);
              formData.append(
                `varieties[${index}][price]`,
                variety.price.toString()
              );
            });
          } else {
            formData.append("varieties", "--empty--");
          }

          if (selectedMenu._id !== "-1") {
            //Edit selected
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/menuItem/${selectedMenu._id}`,
              {
                method: "PATCH",
                headers: headers,
                body: formData,
              }
            );
            const responseData = await response.json();
            resolve(responseData._id);
          } else {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/menuItem`,
              {
                method: "POST",
                headers: headers,
                body: formData,
              }
            );
            const responseData = await response.json();
            resolve(responseData._id);
          }
        } catch (error) {
          console.error(error);
          reject(error);
        }
        fetchMenu();
        handleClose();
      }
    });
  };

  const saveAddOns = () => {
    if (isVisible && addOnTitle && addOnPrice) {
      const newAddOn = {
        title: addOnTitle,
        price: parseFloat(addOnPrice),
      } as iSubMenu;
      setSelectedMenu((prevMenu) => ({
        ...prevMenu,
        addOns: [...(prevMenu.addOns || []), newAddOn],
      }));
      setAddOnTitle("");
      setAddOnPrice("");
    }
    setIsVisible(!isVisible);
  };

  const saveVareity = () => {
    if (isVisible2 && varietyTitle && varietyPrice) {
      const newVariety = {
        title: varietyTitle,
        price: parseFloat(varietyPrice),
      } as iSubMenu;
      setSelectedMenu((prevMenu) => ({
        ...prevMenu,
        varieties: [...(prevMenu.varieties || []), newVariety],
      }));
      setVarietyTitle("");
      setVarietyPrice("");
    }
    setIsVisible2(!isVisible2);
  };

  const removeAddOns = (index: number) => {
    if (selectedMenu.addOns) {
      const updatedAddOns = selectedMenu.addOns.filter((_, i) => i !== index);
      const updatedMenu = { ...selectedMenu, addOns: updatedAddOns };
      setSelectedMenu(updatedMenu);
    }
  };

  const removeVarieties = (index: number) => {
    if (selectedMenu.varieties) {
      const updatedVarieties = selectedMenu.varieties.filter(
        (_, i) => i !== index
      );
      const updatedMenu = { ...selectedMenu, varieties: updatedVarieties };
      setSelectedMenu(updatedMenu);
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem("token");
        const branch_Id = localStorage.getItem("branch_Id");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pos/transaction?branch_Id=${branch_Id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const transactionData = await response.json();
        setTransaction(transactionData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransaction();
  }, []);

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div style={{ marginTop: 10, paddingLeft: 50, paddingRight: 50 }}>
      <Dialog open={open}>
        <div style={{ width: 400 }}>
          <DialogTitle>
            {selectedMenu._id === "-1" ? `Add` : "Edit"} Menu
            <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <div className={Styles.modalContainer}>
            <div>
              <div>
                {selectedMenu.photo && (
                  <div>
                    <img
                      src={
                        typeof selectedMenu.photo === "string"
                          ? selectedMenu.photo
                          : URL.createObjectURL(selectedMenu.photo)
                      }
                      alt="Selected"
                      width="180"
                      height="150"
                      style={{ borderRadius: 10 }}
                    />
                  </div>
                )}
                <button
                  className={Styles.uploadImg_menu}
                  onClick={handleUpload}
                >
                  Upload Image
                </button>
              </div>
              <input
                type="file"
                ref={hiddenFileInput}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className={Styles.form}>
              <TextField
                value={selectedMenu?.title}
                label="Title"
                name="title"
                variant="outlined"
                size="small"
                onChange={(e) => handleChangeText("title", e.target.value)}
                style={{ marginBottom: "12px", width: 300 }}
              />

              <TextField
                value={selectedMenu?.price || ""}
                label="Price"
                type="number"
                variant="outlined"
                name="price"
                onChange={(e) => handleChangeText("price", e.target.value)}
                size="small"
                style={{ marginBottom: "12px", width: 300 }}
              />
              <TextField
                value={selectedMenu?.quantity || ""}
                label="Quantity"
                type="number"
                variant="outlined"
                name="quantity"
                onChange={(e) => handleChangeText("quantity", e.target.value)}
                size="small"
                style={{ marginBottom: "12px", width: 300 }}
              />
              <TextField
                value={selectedMenu?.description}
                label="Description"
                variant="outlined"
                name="description"
                multiline
                rows={3}
                onChange={(e) =>
                  handleChangeText("description", e.target.value)
                }
                size="small"
                style={{ marginBottom: "12px", width: 300 }}
              />

              <FormControl
                size="small"
                style={{ marginBottom: "12px", width: 300 }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  value={
                    selectedMenu?.menuCategories &&
                    selectedMenu.menuCategories[0]
                  }
                  label="Category"
                  onChange={handleDropdownChange}
                >
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category: iCategoryDOM, key: number) => (
                      <MenuItem value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                value={selectedMenu?.cookingTime || ""}
                label="Cooking Time"
                variant="outlined"
                name="cookingTime"
                onChange={(e) =>
                  handleChangeText("cookingTime", e.target.value)
                }
                size="small"
                style={{ marginBottom: "12px", width: 300 }}
              />

              <div style={{ width: 300 }} className={Styles.subMenu}>
                {selectedMenu.addOns && selectedMenu.addOns.length > 0 ? (
                  <div>
                    <h5>Add-Ons</h5>
                    {selectedMenu.addOns.map((addOn, index) => (
                      <div className={Styles.subMenu_items} key={index}>
                        <span className={Styles.subM_value}>{addOn.title}</span>
                        <div>
                          <span className={Styles.subM_value}>
                            ₱ {addOn.price}
                          </span>
                          <span>
                            <IconButton onClick={() => removeAddOns(index)}>
                              <RemoveCircleIcon
                                style={{ color: "red", fontSize: 18 }}
                              />
                            </IconButton>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h5>No Add-Ons</h5>
                )}
                {!isVisible ? (
                  <button className={Styles.subMenu_btn} onClick={saveAddOns}>
                    Add Add-ons here
                  </button>
                ) : null}
                {isVisible && (
                  <>
                    <div>
                      <p className={Styles.label}>Title</p>
                      <input
                        type="text"
                        placeholder="Title"
                        value={addOnTitle}
                        className={Styles.subMenu_input}
                        onChange={(e) => setAddOnTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <p className={Styles.label}>Price</p>
                      <input
                        type="number"
                        placeholder="Price"
                        value={addOnPrice.toString()}
                        className={Styles.subMenu_input}
                        onChange={(e) => setAddOnPrice(e.target.value)}
                      />
                    </div>
                    <button onClick={saveAddOns} className={Styles.subMenu_btn}>
                      {isVisible ? "Save" : "Add"}
                    </button>
                  </>
                )}
              </div>

              <div style={{ width: 300 }} className={Styles.subMenu}>
                {selectedMenu.varieties && selectedMenu.varieties.length > 0 ? (
                  <div>
                    <h5>Variety</h5>
                    {selectedMenu.varieties.map((variety, index) => (
                      <div className={Styles.subMenu_items} key={index}>
                        <span className={Styles.subM_value}>
                          {variety.title}
                        </span>
                        <div>
                          <span className={Styles.subM_value}>
                            ₱ {variety.price}
                          </span>
                          <span>
                            <IconButton onClick={() => removeVarieties(index)}>
                              <RemoveCircleIcon
                                style={{ color: "red", fontSize: 18 }}
                              />
                            </IconButton>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <h5>No Variety</h5>
                  </>
                )}
                {!isVisible2 ? (
                  <button className={Styles.subMenu_btn} onClick={saveVareity}>
                    Add Variety here
                  </button>
                ) : null}
                {isVisible2 && (
                  <>
                    <div>
                      <p className={Styles.label}>Title</p>
                      <input
                        type="text"
                        placeholder="Title"
                        value={varietyTitle}
                        className={Styles.subMenu_input}
                        onChange={(e) => setVarietyTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <p className={styles.label}>Price</p>
                      <input
                        type="number"
                        placeholder="Price"
                        value={varietyPrice.toString()}
                        className={Styles.subMenu_input}
                        onChange={(e) => setVarietyPrice(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={saveVareity}
                      className={Styles.subMenu_btn}
                    >
                      {isVisible2 ? "Save" : "Add"}
                    </button>
                  </>
                )}
              </div>

              {errors !== "" && <p style={{ color: "#ff0000" }}>{errors}</p>}
              <div className={Styles.modal_btn}>
                {selectedMenu._id !== "-1" && (
                  <button
                    className={`${Styles._button} ${styles.primary_color_btn}`}
                    onClick={() =>
                      transaction.length > 0
                        ? CannotDelete(selectedMenu)
                        : handleDelete(selectedMenu)
                    }
                  >
                    Delete
                  </button>
                )}
                <button
                  className={`${Styles._button} ${styles.btn_save_color}`}
                  onClick={() => handleAddMenu()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default MenuModal;
