// DoctorDetails.jsx

import React, { useState, useEffect } from 'react';
import { db } from '@/backend/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

function DoctorDetails({ doctorId }) {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const doctorDetails = useSelector((state) => state.doctorDetails);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorDocRef = doc(db, 'users', doctorId);
        const doctorDocSnap = await getDoc(doctorDocRef);

        if (doctorDocSnap.exists()) {
          setDoctorData(doctorDocSnap.data());
        } else {
          console.error('Doctor not found');
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  return (
    <div>

      {loading ? (
        <p>Loading doctor details...</p>
      ) : doctorData ? (
        <>
           <h2>{doctorDetails.FullName}</h2>
          <h2>{doctorData.FullName}</h2>
          <img src={doctorData.photoURL} alt={doctorData.FullName} className="img-fluid" />
          {/* Display other details as needed */}
        </>
      ) : (
        <p>Doctor not found</p>
      )}
    </div>
  );
}

export default DoctorDetails;
