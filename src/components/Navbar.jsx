import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import styles from './Navbar.module.css';

const Navbar = ({ title }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <h1>{title}</h1>
      <div className={styles.navLinks}>
        <Link href="/projects">Projects</Link>
        <Link href="/map">Map View</Link>
        <Link href="/charts">Analytics</Link>
      </div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar; 