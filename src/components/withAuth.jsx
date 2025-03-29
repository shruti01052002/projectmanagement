import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/login');
        } else if (!user.emailVerified) {
          // If user is not verified, sign them out and redirect to login
          auth.signOut();
          router.push('/login');
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    // Show nothing while checking auth state
    if (isLoading) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth; 