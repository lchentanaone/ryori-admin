import React from "react";
import styles from "./../styles/terms.module.css";

const TearmAndConditions = () => {
  const handleEmailPress = () => {
    const email = "mailto:ryoridavao@gmail.com";
    window.location.href = email;
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalView}>
        <div>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <p className={styles.label}>Welcome to Ryori App!</p>
            <p className={styles.text}>
              These terms and conditions govern your use of our Android-based QR
              Code Ordering System.
            </p>
          </div>
          <div style={{ textAlign: "left", marginTop: 20 }}>
            <div>
              <p className={styles.label}>1. Registration and Free Orders</p>
              <p className={styles.text}>
                1.1. Upon registration, the restaurant is entitled to 100 free
                orders.
              </p>
            </div>
            <br />
            <div>
              <p className={styles.label}>
                2. Billing for Non-Subscribed Users
              </p>
              <p className={styles.text}>
                2.1. For users not subscribed to a plan, billing will occur at a
                rate of ₱8 per transaction every 30 days after the initial 100
                free orders.
              </p>
            </div>
            <br />
            <div>
              <p className={styles.label}>3. Subscription Plans</p>
              <p className={styles.text}>
                3.1. The subscription plans available are:
                <br />
                <br />
                a) ₱1799 Plan: Allows for 300 orders within 30 days. Exceeding
                300 orders will incur a charge of ₱8 per transaction for the
                excess.
                <br />
                <br />
                b) ₱3999 Plan: Offers unlimited transactions for a 30-day
                period.
                <br />
                <br />
                3.2. If the subscribed order limit is not reached within 30
                days, the customer will be billed the subscription fee (₱1799)
                for the next cycle.
              </p>
            </div>
            <br />
            <div>
              <p className={styles.label}>4. Hacking or Unauthorized Access</p>
              <p className={styles.text}>
                4.1. Any attempt or act of hacking, unauthorized access, or
                misuse of the system is strictly prohibited and may result in
                legal action.
              </p>
            </div>
            <br />
            <div>
              <p className={styles.label}>5. Miscellaneous</p>
              <p className={styles.text}>
                5.1. We reserve the right to modify these terms and conditions
                at any time. Users will be notified of changes via email or
                through the app.
                <br />
                <br />
                5.2. Our liability is limited to the extent permitted by law.
                <br />
                <br />
                5.3. By using our service, you agree to comply with all
                applicable laws and regulations.
              </p>
            </div>
            <br />
            <div>
              <p className={styles.label}>6. Contact Us</p>
              <p className={styles.text}>
                6.1. For any inquiries or assistance, please contact us at
                &nbsp;
                <span
                  onClick={handleEmailPress}
                  style={{
                    textDecoration: "underline",
                    color: "#BD0A0A",
                    cursor: "pointer",
                  }}
                >
                  ryori.alreno@gmail.com.
                </span>
              </p>
              <br />
              <p className={styles.text}>
                By using our services, you agree to abide by these terms and
                conditions. Failure to comply may result in the suspension or
                termination of access to our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TearmAndConditions;
