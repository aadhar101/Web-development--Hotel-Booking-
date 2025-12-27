import styles from "./register.module.css";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      {/* Left */}
      <div className={styles.imageSection}>
        <div className={styles.glassCard}>
          <h1>Hotel Booking.</h1>
        </div>
      </div>

      {/* Right */}
      <div className={styles.formSection}>
        <h2>Create Account</h2>

        <label>Name</label>
        <input placeholder="Enter your name" />

        <label>Email</label>
        <input placeholder="name@gmail.com" />

        <label>Phone No</label>
        <input placeholder="With Country Code" />

        <label>Country</label>
        <input placeholder="Country Name" />

        <label>Username</label>
        <input placeholder="Username" />

        <label>Password</label>
        <input type="password" placeholder="6+ characters" />

        <button>Register</button>

        <p className={styles.link}>
          <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
