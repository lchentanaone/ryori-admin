// @ts-nocheck
import React, { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import style from "./style.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import ryoToken from "../../../../../public/ryoToken.png";
import Image from "next/image";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  customerWallet: string;
  setCustomerWallet: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  fromWallet: any;
  id: string;
  fetchReviewsData: () => Promise<void>;
  fetchMint: () => Promise<void>;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  customerWallet,
  setCustomerWallet,
  fromWallet,
  id,
  fetchReviewsData,
  fetchMint,
}) => {
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  const { publicKey, sendTransaction, connected } = useWallet();
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const handleClose = () => {
    fetchReviewsData();
    fetchMint();
    onClose();
    setSignature("");
    setAmount(0);
  };
  const mintToken = process.env.NEXT_PUBLIC_SOLANA_MINT_ADDRESS;
  if (!mintToken) {
    throw new Error(
      "Solana mint address is not defined in environment variables."
    );
  }
  const mintPublicKey = new PublicKey(mintToken);
  const handleCustomerWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomerWallet(event.target.value);
  };
  const handleChange = (e: any) => {
    const value = e.target.value;

    // Use a regular expression to allow valid numbers and decimal points
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value); // Keep value as string for now
    }
  };

  // Later, when you need to use the amount as a number, convert it like this:
  // const numericAmount = parseFloat(amount) || 0;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isRewarded: "true",
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchReviewsData();
      fetchMint();
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const transferRyo = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet");
      return;
    }
    if (amount <= 0) {
      alert("The transfer amount must be greater than zero");
      return;
    }
    setLoading(true);
    try {
      const recipientPublicKey = new PublicKey(customerWallet);

      // Get or create the sender's token account
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey, // Fee payer and signer
        mintPublicKey,
        publicKey
      );

      // Get or create the recipient's token account
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey, // Fee payer
        mintPublicKey, // token mint address
        recipientPublicKey // recipient's public key
      );

      // Create the transfer instruction
      const transferInstruction = createTransferInstruction(
        senderTokenAccount.address, // sender's token account
        recipientTokenAccount.address, // recipient's token account
        publicKey, // sender's public key as the authority
        amount * 1e9, // amount to send (tokens with 9 decimals)
        [],
        TOKEN_PROGRAM_ID
      );

      // Create a transaction and add the transfer instruction
      const transaction = new Transaction().add(transferInstruction);

      // Send the transaction using Phantom wallet to sign it
      const txSignature = await sendTransaction(transaction, connection);
      if (txSignature) {
        // If transfer is successful, update the review
        await handleUpdate();
        console.log("Tokens transferred successfully!");
        setStatus("Tokens transferred successfully");
        setSignature(txSignature);
      }
    } catch (error) {
      console.error("Error transferring tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  // if (signature) {
  //   setSignature("");
  //   onClose();
  // }
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        <div className={style.modalTitle}>
          <Image src={ryoToken} alt="ryo" className={style.token} />
          <span>
            {signature
              ? "Tokens have been transferred successfully!"
              : "Send RYO Token"}
          </span>
        </div>
      </DialogTitle>
      {!signature ? (
        <DialogContent>
          <div className="input-group">
            <Typography variant="body1" className="label">
              From
            </Typography>
            <TextField
              value={fromWallet}
              placeholder="From Address"
              variant="outlined"
              name="fromWallet"
              // onChange={handleToChange}
              size="small"
              style={{ width: "85%" }}
            />
          </div>

          <div className="input-group">
            <Typography variant="body1" className="label">
              To
            </Typography>
            <TextField
              value={customerWallet}
              placeholder="To Address"
              variant="outlined"
              name="customerWallet"
              onChange={handleCustomerWalletChange}
              size="small"
              style={{ width: "85%" }}
            />
          </div>
          <div className="input-group">
            <Typography variant="body1" className="label">
              Amount
            </Typography>
            <TextField
              value={amount}
              placeholder="Wallet Address"
              variant="outlined"
              name="amout"
              onChange={handleChange}
              size="small"
              style={{ width: "85%" }}
            />
          </div>
        </DialogContent>
      ) : (
        <div className={style.signature}>
          <p className={style.signatureText}>{signature}</p>
        </div>
      )}

      <DialogActions>
        <button
          onClick={handleClose}
          className={`${style.cancelSendBtn} ${style.cancelBtn}`}
        >
          Close
        </button>
        {!signature ? (
          <button
            onClick={transferRyo}
            disabled={loading}
            className={`${style.cancelSendBtn} ${style.sendBtn}`}
          >
            {loading ? <CircularProgress size="15px" /> : "Send"}
          </button>
        ) : null}
      </DialogActions>

      <style jsx>{`
        .input-group {
          display: flex;
          align-items: center;
          margin-top: 20px;
          justify-content: space-between;
        }

        .label {
          min-width: 40px;
          margin-right: 10px;
        }
      `}</style>
    </Dialog>
  );
};

export default Modal;
