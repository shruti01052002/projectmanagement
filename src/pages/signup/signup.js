import { useForm } from "react-hook-form";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import styles from "./signup.module.css"; // Use CSS Modules

export default function Signup() {
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      alert("Signup successful!");
    } catch (err) {
      alert(err.message);
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
          {...register("confirmPassword", { required: "Confirm Password is required" })}
        />
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link href="/login">Log In</Link>
        </p>
        <p>
          <Link href="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
}
