// DoctorFeedback.jsx

import React, { useState, useEffect } from 'react';
import { db } from '@/backend/firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';

function DoctorFeedback({ doctorId }) {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'feedback'), where('doctorId', '==', doctorId));
        const querySnap = await getDocs(q);

        const data = [];
        querySnap.forEach((doc) => {
          const feedback = doc.data();
          data.push({ id: doc.id, ...feedback });
        });

        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  return (
    <div>
      <h2>Feedback for Doctor</h2>
      {loading ? (
        <p>Loading feedback...</p>
      ) : (
        <ul>
          {feedbackData.map((feedback) => (
            <li key={feedback.id}>
              <p>{feedback.feedback}</p>
              <p>Rating: {feedback.rating}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DoctorFeedback;
