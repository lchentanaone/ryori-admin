// import React, { useState, useRef, useEffect } from "react";
// import { TextField } from "@mui/material";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import Swal from "sweetalert2";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import Styles from "./style.module.css";
// import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// import AddIcon from "@mui/icons-material/Add";
// import ClearIcon from "@mui/icons-material/Clear";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import {
//   DialogContent,
//   DialogContentText,
// } from "@mui/material";
// import dialogStyle from "./diaglogStyle.module.css";
// import RemoveIcon from "@mui/icons-material/Remove";

// const DetailsModal: React.FC<DetailsModalProps> = (
//   {
//     selectedItem
//     transItemQty,
//     handleClose
//     openDialog
//     setOpenDialog

//   }
// ) => {
//   const [quantity, setQuantity] = useState(0);

//   const handleIncrease = () => {
//     const newQuantity = parseInt(quantity.toString()) + 1;
//     setQuantity(newQuantity);
//   };

//   const handleDecrease = () => {
//     const newQuantity = Math.max(1, parseInt(quantity.toString(), 10) - 1);
//     setQuantity(newQuantity);
//   };
//   return (
//     <>
//     <Dialog onClose={handleClose} open={openDialog}>
//           <div className={dialogStyle.container}>
//             <div style={{ position: "relative" }}>
//               <div style={{ position: "absolute", top: 0, right: 0 }}>
//                 <IconButton onClick={() => setOpenDialog(false)}>
//                   <ClearIcon style={{ color: "#fff", fontSize: "22" }} />
//                 </IconButton>
//               </div>
//             </div>
//             <DialogContent>
//               <DialogContentText>
//                 <div>
//                   {selectedItem && (
//                     <>
//                       <div>
//                         <div>
//                           <span className={dialogStyle.text}>
//                             {selectedItem.menuItem.title}{" "}
//                           </span>
//                           <span className={dialogStyle.textPrice}>
//                             ₱{selectedItem.menuItem.price}
//                           </span>
//                         </div>
//                         <span className={dialogStyle.textPrice}>Add-Ons</span>
//                         {selectedItem.addons?.length > 0 && (
//                           <>
//                             {/* {console.log("Add-Ons:", selectedItem.addons)}{" "} */}
//                             {/* Log addons array */}
//                             <h6>Add-Ons</h6>
//                             {selectedItem.addons.map(
//                               (addOn: AddOns, index: number) => {
//                                 // console.log("Add-On:", addOn); // Log each addon object
//                                 return (
//                                   <div key={index} style={{ marginLeft: 20 }}>
//                                     <h6 className={dialogStyle.textPrice}>
//                                       <span>✔</span> {addOn.title} ₱
//                                       {addOn.price}
//                                     </h6>
//                                   </div>
//                                 );
//                               }
//                             )}
//                           </>
//                         )}
//                       </div>
//                       <div className={dialogStyle.center}>
//                         <div className={dialogStyle.qtyContainer}>
//                           <span className={dialogStyle.textqty}>Quantity</span>
//                           <div className={dialogStyle.quantity}>
//                             <button
//                               className={`${dialogStyle.iconBtn} ${dialogStyle.iconBtnMinus}`}
//                               onClick={handleDecrease}
//                             >
//                               <RemoveIcon
//                                 style={{ color: "#fff", fontSize: "25" }}
//                               />
//                             </button>
//                             <div className={dialogStyle.qtyValue}>
//                               {quantity}
//                             </div>
//                             <button
//                               className={`${dialogStyle.iconBtn} ${dialogStyle.iconBtnPlus}`}
//                               onClick={handleIncrease}
//                             >
//                               <AddIcon
//                                 style={{ color: "#fff", fontSize: "25" }}
//                               />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className={dialogStyle.dialogBtn}>
//                         <button
//                           onClick={() => {
//                             transItemQty("cancelled", selectedItem, undefined);
//                           }}
//                           className={`${dialogStyle.btn} ${dialogStyle.cancelBtn}`}
//                         >
//                           <DeleteOutlineIcon style={{ fontSize: "20" }} />
//                           Delete this Item
//                         </button>
//                         <button
//                           onClick={() => {
//                             transItemQty(undefined, selectedItem, quantity);
//                           }}
//                           className={`${dialogStyle.btn} ${dialogStyle.confirmBtn}`}
//                         >
//                           Confirm
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </DialogContentText>
//             </DialogContent>
//           </div>
//         </Dialog>
//     </>
//   );
// };
// export default DetailsModal;
