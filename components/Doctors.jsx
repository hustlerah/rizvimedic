import React, { useEffect, useState } from 'react';
import { auth, db } from '@/backend/firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import Link from 'next/link';
import DoctorFeedback from './Feedbackdoctor';

function Doctors() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userExperiences, setUserExperiences] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);

  useEffect(() => {
    // Fetch the current user's UID
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserUid(user.uid);
      } else {
        setCurrentUserUid(null);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchDataForDoctors() {
      const q = query(collection(db, 'users'), where('role', '==', 'doctor'), limit(3));
      const querySnap = await getDocs(q);

      const data = [];
      querySnap.forEach((doc) => {
        const { photoURL, ...otherData } = doc.data();
        data.push({ id: doc.id, photoURL, ...otherData });
      });

      return data.length > 0 ? data : null;
    }

    async function fetchUserExperiences() {
      try {
        const userDataCollectionRef = collection(db, 'userData');
        const snapshot = await getDocs(userDataCollectionRef);

        const allUserData = [];
        snapshot.forEach((doc) => {
          const userData = doc.data();
          allUserData.push({ id: doc.id, ...userData });
        });

        const experiences = allUserData.map((userData) => ({
          id: userData.id,
          experiences: userData.experiences || [],
        }));

        setUserExperiences(experiences);
      } catch (error) {
        console.error('Error fetching user experiences:', error);
      }
    }

    async function fetchData() {
      try {
        const data = await fetchDataForDoctors();
        if (data) {
          setUserData(data);
        } else {
          console.log('Error fetching doctor data.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    fetchUserExperiences();
  }, []);

  return (
    <>
      <div className="Doctors">
        <div className="container">
          <h2 className="text-center mt-2">Our Doctors</h2>
          <div className="df">
            <p className="mt-3 text-center col-md-5">
              World-class care for everyone. Our health system offers unmatched, expert health care
            </p>
          </div>
          <div className="row mt-5">
            {userData.map((user) => (
              <div className="col-md-4 mt-2" key={user.id}>
                <Link
  href={`/feedback?doctorId=${user.id}&userId=${currentUserUid}&doctorName=${user.FullName}&photoURL=${encodeURIComponent(user.photoURL)}&about=${user.about}&experiences=${encodeURIComponent(JSON.stringify(user.experiences))}&qualifications=${encodeURIComponent(JSON.stringify(user.qualifications))}`}
>
         <div className="card">
                  <img src={user.photoURL} alt={user.FullName} className="img-fluid" />
                  <h3>{user.FullName}</h3>

                  {/* Display job titles from experiences */}
                  {user.experiences && user.experiences.length > 0 && (
                    <div className="bg-o df6 mt-2">
          <div className="d-blk">
            <p className='p-2'>Mounted at {user.experiences[0].company}</p>
           {/* Pass doctorId to DoctorFeedback component */}

          </div>
        </div>
      )}
                </div>
            </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Doctors;

