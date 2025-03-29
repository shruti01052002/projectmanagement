'use client';

import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import styles from "../pages/signup.module.css";
import { auth } from "../services/firebase";
import { useState } from "react";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const { register, handleSubmit, watch, setError: setFormError, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true); 
      setError('');

      if (data.password !== data.confirmPassword) {
        setFormError("confirmPassword", { message: "Passwords do not match" });
        setLoading(false);
        return;
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Send verification email
      try {
        await sendEmailVerification(userCredential.user, {
          url: window.location.origin + '/login', // Redirect URL after verification
        });
        setVerificationSent(true);
      } catch (verificationError) {
        console.error("Verification email error:", verificationError);
        setError("Account created but couldn't send verification email. Please try logging in to resend verification.");
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please try logging in.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled. Please contact support.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters.');
          break;
        default:
          setError(err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1>Sign Up</h1>
      
      <input
        type="email"
        placeholder="Email"
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
        className={styles.input}
      />
      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", { 
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters"
          }
        })}
        className={styles.input}
      />
      {errors.password && <p className={styles.error}>{errors.password.message}</p>}
      
      <input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword", { 
          required: "Confirm Password is required",
          validate: value => value === password || "Passwords do not match"
        })}
        className={styles.input}
      />
      {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}

      <button 
        type="submit"
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      
      {verificationSent && (
        <p className={styles.success}>
          Verification email sent! Please check your inbox and click the verification link.
        </p>
      )}
      
      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </form>
  );
} 