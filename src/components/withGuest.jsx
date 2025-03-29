import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const withGuest = (WrappedComponent) => {
  return function WithGuestComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
          router.push('/projects');
        }
      });

      return () => unsubscribe();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withGuest; 