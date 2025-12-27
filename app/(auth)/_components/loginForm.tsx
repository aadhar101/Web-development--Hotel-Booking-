import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.glassCard}>
          <h1>Hotel Booking.</h1>
        </div>
      </div>

      <div className={styles.formSection}>
        <h2>Welcome Back</h2>
        <p className={styles.subtitle}>Please enter your details to sign in</p>

        <div className={styles.formGroup}>
          <label>Username</label>
          <input type="text" placeholder="Enter your username" />
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input type="password" placeholder="6+ characters" />
        </div>

        <Link rel="stylesheet" href="/dashboard">
            <button>Login</button>
        </Link>

        <p className={styles.link}>
          <Link href="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}