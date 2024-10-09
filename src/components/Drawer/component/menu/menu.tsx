import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import styles from "../../component/style/styles.module.css";
import { truncateText } from "@/utils/utils";
import MenuModal from "./menuModal";

export default function MenuCard() {
  const [items, setItems] = useState<MenuData[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuData>({
    _id: "-1",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");
      const branch_Id = localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menuItem?store_Id=${store_Id}&branch_Id=${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      setItems(responseData);
      // setAddOns(response.addOns)
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: Rename this handleUpdate to a selectItem because no update is done here yet, just selecting which item to update.
  const handleSelect = (item: MenuData) => {
    setSelectedMenu(item);
    // console.log("------->>>", item.addOns);
    setOpen(true);
  };

  useEffect(() => {
    fetchMenu();
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div style={{ marginTop: 10, paddingLeft: 50, paddingRight: 50 }}>
      <h1 className="title_page">Menu</h1>
      <div>
        <button
          onClick={handleOpen}
          className={`${styles._button} ${styles.primary_color_btn}`}
        >
          Add Menu
        </button>
        <MenuModal
          open={open}
          setOpen={setOpen}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          fetchMenu={fetchMenu}
          // handleSave={handleSave}
          // errors={errors}
        />
      </div>
      <Box sx={{ gap: 4, display: "flex", flexWrap: "wrap" }}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <Card
              key={index}
              sx={{
                width: 250,
                maxHeight: 400,
                marginTop: 2,
                marginBottom: 2,
                cursor: "pointer",
              }}
              onClick={() => handleSelect(item)}
            >
              <img
                src={item.photo}
                width={200}
                height={100}
                alt="img"
                className={styles.menuImage}
              />
              <CardContent>
                <p className={styles.title}>{truncateText(item.title, 42)}</p>
                <p className={styles.price}> ₱ {item.price}</p>
                <p className={styles.desrip}>
                  {truncateText(item.description, 80)}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="loading">Loading . . .</div>
        )}
      </Box>
    </div>
  );
}
