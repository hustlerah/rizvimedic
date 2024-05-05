import { auth, db } from '@/backend/firebase';
import { faBars, faPlus, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function Navbar() {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  console.log(scrollY)
  const isActivert = (href) => {
    return router.pathname === href ? 'active' : '';
  };

  const handlePress = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Sign-out Error:', error.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataForCurrentUser();
      if (data) {
        setUserData(data);
      } else {
        console.log('No user is signed in.');
      }
    }

    fetchData();
  }, []);

  async function fetchDataForCurrentUser() {
    const user = auth.currentUser;

    if (user) {
      const userUID = user.uid;
      const q = query(collection(db, 'users'), where('uid', '==', userUID));
      const querySnap = await getDocs(q);

      const data = [];
      querySnap.forEach((doc) => {
        const { photoURL, ...otherData } = doc.data();
        data.push({ id: doc.id, photoURL, ...otherData });
      });

      return data;
    } else {
      return null;
    }
  }

  return (
    <>
 <div className={`myheader ${isActive ? 'active' : ''} ${scrollY >= 70 || !isActivert('/') ? 'bg-active' : ''}`}>  <div className="container">
    <div className="nava">
      <div className="navbar-brand">
        <Link href={'/'}>
          <div className="d-flex align-items-center justify-content-center">
            <FontAwesomeIcon icon={faPlus} className="my-p mt-2" size="2xl" color="#0067ff" style={{ fontWeight: 'bolder' }} />
            <h1>Rizvi Medic</h1>
          </div>
        </Link>
      </div>
      <div className="menu-overlay" onClick={handlePress}></div>
      <div className="mynav">
        <div className="container d-flex align-items-center-justify-content-center mt-4 mx-2">
          <Link href={'/'}>
            <div className="d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={faPlus} className="my-p mt-2" size="2xl" color="#0067ff" style={{ fontWeight: 'bolder' }} />
              <h1>Rizvi Medic</h1>
            </div>
          </Link>
        </div>
        <ul>
          <li className={`nav-item mt-4 mx-3 ${isActivert('/')}`}>
            <Link href={'/'}>
              Home
            </Link>
          </li>
          <li className={`nav-item mt-4 mx-3 ${isActivert('/services')}`}>
            <Link href={'/services'}>
              Services
            </Link>
          </li>
          <li className={`nav-item mt-4 mx-3 ${isActivert('/doctors')}`}>
            <Link href={'/doctors'}>
              Doctors
            </Link>
          </li>
          <li className={`nav-item mt-4 mx-3 ${isActivert('/contact')}`}>
            <Link href={'/contact'}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-icons df">
        <div className="icon-box mt-2 mx-3 d-none" onClick={handlePress}>
          <FontAwesomeIcon icon={faBars} size="lg" color="#111111" />
        </div>
        {loggedIn ? (
          <button className="mt-2 mynavbtn btnpr d-none" onClick={handleSignOut}>
            Logout
          </button>
        ) : (
          <Link href={'/user/login'}>
            <div className="mt-2 mynavbtn btnpr">Login</div>
          </Link>
        )}
      {loggedIn && userData.length > 0 && (
  <Link href={userData[0].role === 'doctor' ? '/doctor/profile' : '/user/profile'}>
    {userData[0].photoURL ? (
      <img
        className="profile-pic mt-1"
        src={userData[0].photoURL}
        alt="Profile"
        width={'30px'}
        height={'30px'}
        style={{ borderRadius: '50%', border: '1px solid #0067ff' }}
      />
    ) : (
      <FontAwesomeIcon
        icon={faUserCircle}
        className="profile-pic mt-2" // Adjust the styling as needed
        size={'xl'}
        color="#0067ff" // Adjust the color as needed
      />
    )}
  </Link>
)}

      </div>
    </div>
  </div>
</div>

    </>
  );
}

export default Navbar;
