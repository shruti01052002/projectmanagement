import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import styles from "./login.module.css"; // Use CSS Modules

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const auth = getAuth();
    console.log(auth.config, "check");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      alert("Login successful!");
    } catch (err) {
      alert(err.message);
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
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        <button type="submit">Log In</button>
        <p>
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
