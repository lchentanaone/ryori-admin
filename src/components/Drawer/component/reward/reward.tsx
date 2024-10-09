// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Image from "next/image";
import styles from "./style.module.css";
import user from "../../../../../public/avatar1.png";
import Modal from "./modal";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import {
  getMint,
  getOrCreateAssociatedTokenAccount,
  getAccount,
} from "@solana/spl-token";
import SendIcon from "@mui/icons-material/Send";
import ryoToken from "../../../../../public/ryoToken.png";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface ReviewData {
  _id: string;
  rating: string;
  description: string;
  customerWallet: string;
  profileImageUrl: string;
  isRewarded: boolean;
}

const RewardReviews: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [customerWallet, setCustomerWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [mintBalance, setMintBalance] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [signature, setSignature] = useState("");
  const [id, setId] = useState("");

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  useEffect(() => {
    const getBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1000000000); // Convert lamports to SOL
      }
    };

    if (connected) {
      getBalance();
    } else {
      setBalance(null);
    }
  }, [publicKey, connected]);

  const mintToken = process.env.NEXT_PUBLIC_SOLANA_MINT_ADDRESS;
  if (!mintToken) {
    throw new Error(
      "Solana mint address is not defined in environment variables."
    );
  }
  const mintAccountPublicKey = new PublicKey(mintToken);

  const fetchMintBalance = async () => {
    if (!publicKey) {
      console.error("Wallet is not connected");
      return;
    }

    try {
      // Get or create the token account for the connected wallet
      const walletTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey, // connected wallet public key as fee payer
        mintAccountPublicKey, // Mint address
        publicKey // The connected wallet's public key
      );

      // Fetch token account balance
      const accountInfo = await getAccount(
        connection,
        walletTokenAccount.address
      );
      console.log(accountInfo.amount.toString());
      setMintBalance(Number(accountInfo.amount)); // Set the token balance in state
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };
  useEffect(() => {
    fetchMintBalance();
  }, [publicKey]);

  const fetchReviewsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = await localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews?branch_Id=${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setReviews(responseData);
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const handleSelect = (wallet: any) => {
    if (!publicKey) {
      alert("Please connect your wallet");
    } else {
      setIsOpen(true);
      setCustomerWallet(wallet.customerWallet);
      setId(wallet._id);
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    setSignature("");
  };

  useEffect(() => {
    fetchReviewsData();
    const existingToken = localStorage.getItem("token");

    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <Grid container justifyContent="center" height="100vh">
      <div>
        <h1>Customers Experiences</h1>
        <div className={styles.ryo}>
          <div className={styles.center}>
            <p className={styles.label}>
              <Image src={ryoToken} alt="ryo" height={20} width={20} />
              RYO Balance
            </p>
            <p className={styles.balance}>
              {mintBalance !== null
                ? (mintBalance / Math.pow(10, 9)).toFixed(9)
                : "Loading..."}
            </p>
          </div>
          <WalletMultiButton
            style={{ backgroundColor: "#DB1B1B", height: 55 }}
          />
          {/* <p className="text-gray-600">{publicKey?.toBase58()}</p> */}
        </div>
        <div className={styles.reviewsContainer}>
          {reviews
            .sort((a, b) =>
              a.isRewarded === b.isRewarded ? 0 : a.isRewarded ? 1 : -1
            )
            .map((review, index) => (
              <div key={index} className={styles.review}>
                <Image
                  src={user}
                  alt="Profile Image"
                  width={50}
                  height={50}
                  className={styles.profileImage}
                />
                <div className={styles.reviewText}>
                  <div className="stars">
                    {Array.from({ length: Number(review.rating) }).map(
                      (_, starIndex) => (
                        <span key={starIndex} className={styles.stars}>
                          ★
                        </span>
                      )
                    )}
                  </div>
                  <p className="review-content">{review.description}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleSelect(review)}
                    className={`${styles.sendButton} ${
                      review.isRewarded ? styles.disabledButton : ""
                    }`} // Apply a different style if disabled
                    disabled={review.isRewarded}
                  >
                    Send
                    <SendIcon className={styles.sendIcon} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal
        open={isOpen}
        id={id}
        onClose={handleClose}
        customerWallet={customerWallet}
        fromWallet={publicKey}
        setCustomerWallet={setCustomerWallet}
        amount={amount}
        setAmount={setAmount}
        fetchReviewsData={fetchReviewsData}
        fetchMint={fetchMintBalance}
      />
    </Grid>
  );
};

export default RewardReviews;
