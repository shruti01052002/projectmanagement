import styles from "./signup.module.css";
import SignupForm from "../components/SignupForm";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../services/firebase";
import { useState } from "react";
import withGuest from "../components/withGuest";

function SignUp() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Sign out the user until they verify their email
      await auth.signOut();
      
      setMessage("Please check your email for verification link before logging in.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1>Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: value => value === password || "Passwords do not match"
          })}
        />
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p>
          Already have an account? <Link href="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default withGuest(SignUp);