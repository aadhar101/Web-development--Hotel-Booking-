"use client";

import styles from "./register.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/action/auth-action";
import { RegisterSchema } from "../schema";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    country: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);
    setLoading(true);

    try {
      const validatedData = RegisterSchema.parse(formData);
      const result = await handleRegister(validatedData);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setMessage({ type: 'error', text: error.message || 'Registration failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Side - Hero Section */}
      <div className={styles.imageSection}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.patternOverlay}></div>
        
        <div className={styles.heroContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.brandName}>LuxeStay</h1>
          </div>
          
          <div className={styles.heroText}>
            <h2>Your Journey to Comfort Begins Here</h2>
            <p>Experience world-class hospitality with seamless booking at your fingertips</p>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✨</div>
              <span>Premium Properties</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🌍</div>
              <span>Global Destinations</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <span>Secure Booking</span>
            </div>
          </div>
        </div>

        <div className={styles.floatingImages}>
          <div className={`${styles.floatingImage} ${styles.floatingImage1}`}></div>
          <div className={`${styles.floatingImage} ${styles.floatingImage2}`}></div>
          <div className={`${styles.floatingImage} ${styles.floatingImage3}`}></div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>Create Account</h2>
            <p>Join thousands of travelers discovering their perfect stay</p>
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              <div className={styles.messageIcon}>
                {message.type === 'success' ? '✓' : '⚠'}
              </div>
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>👤</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    disabled={loading}
                  />
                </div>
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>📱</span>
                  <input
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    disabled={loading}
                  />
                </div>
                {errors.phoneNo && <span className={styles.error}>{errors.phoneNo}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Country</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🌐</span>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Your country"
                    disabled={loading}
                  />
                </div>
                {errors.country && <span className={styles.error}>{errors.country}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Username</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>@</span>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>
                {errors.username && <span className={styles.error}>{errors.username}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🔑</span>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    disabled={loading}
                  />
                </div>
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? (
                <span className={styles.loader}></span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <p className={styles.link}>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>

          <div className={styles.securityBadge}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Your data is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}