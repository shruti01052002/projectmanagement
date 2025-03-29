import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./login.module.css"; // Ensure the correct path
import { auth } from "../services/firebase";
import { useState } from "react";
import withGuest from "../components/withGuest";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      
      // First check if user exists and credentials are correct
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        await auth.signOut(); // Sign out if email is not verified
        setError("Please verify your email before logging in. Check your inbox for the verification link.");
        return;
      }
      
      // Only redirect if email is verified
      router.push("/projects");
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email. Please sign up first.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage("");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent! Please check your inbox.");
      setTimeout(() => {
        setShowResetModal(false);
        setResetEmail("");
      }, 3000);
    } catch (err) {
      setResetMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1>Log In</h1>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        <div className={styles.passwordInput}>
          <input
            type={"password"}
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p>
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </p>
        <button 
          type="button" 
          onClick={() => setShowResetModal(true)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6366f1', 
            cursor: 'pointer',
            padding: '0',
            marginTop: '10px',
            fontSize: '15px',
            textDecoration: 'underline'
          }}
        >
          Forgot Password?
        </button>
      </form>

      {showResetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '420px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              color: '#1e293b',
              fontSize: '2rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>Reset Password</h2>
            <p style={{
              color: '#64748b',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                style={{
                  width: '90%',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'white',
                  color: '#1e293b'
                }}
              />
              {resetMessage && (
                <p style={{
                  color: resetMessage.includes('sent') ? '#10b981' : '#ef4444',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  {resetMessage}
                </p>
              )}
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: '#e2e8f0',
                    color: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default withGuest(Login);