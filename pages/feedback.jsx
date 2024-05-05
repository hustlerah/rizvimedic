
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '@/backend/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Feedback() {
  const router = useRouter();
  const { doctorId, doctorName, photoURL, about, experiences, qualifications } = router.query;
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    // Fetch and display all feedback for the doctor
    async function fetchFeedback() {
      try {
        const feedbackCollectionRef = collection(db, 'feedback');
        const q = query(feedbackCollectionRef, where('doctorId', '==', doctorId));
        const querySnapshot = await getDocs(q);

        const feedbackData = [];
        querySnapshot.forEach((doc) => {
          feedbackData.push(doc.data());
        });

        setFeedback(feedbackData);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    }

    fetchFeedback();
  }, [doctorId]);

  return (
    <div style={{ paddingTop: '90px' }}>
      <h2>Feedback for {doctorName}</h2>
      {/* Display the profile picture */}
      {photoURL && <img src={photoURL} alt={`${doctorName}'s profile`} style={{ width: '100px', height: '100px' }} />}

      {/* Display the "about" information */}
      {about && <p>About: {about}</p>}

      {/* Display all feedback */}
      <div>
        <h3>All Feedback:</h3>
        <ul>
          {feedback.map((item, index) => (
            <li key={index}>{item.feedback}</li>
          ))}
        </ul>

        {/* Display experiences if available */}
        {experiences && (
          <div>
            <h3>Experiences:</h3>
            {isValidJSON(experiences) &&
              JSON.parse(decodeURIComponent(experiences)).map((experience, index) => (
                <div key={index} className="bg-op df6 mt-2">
                  <div className="d-block">
                    <span>{experience.startDate}</span>
                    <p>{experience.jobTitle}</p>
                  </div>
                  <div className="d-block">
                    <span>{experience.endDate}</span>
                    <p>{experience.company}</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Display qualifications if available */}
        {qualifications && (
          <div>
            <h3>Qualifications:</h3>
            {isValidJSON(qualifications) &&
              JSON.parse(decodeURIComponent(qualifications)).map((qualification, index) => (
                <div key={index} className="bg-op df6 mt-2">
                  <div className="d-block">
                    <span>{qualification.startDate}</span>
                    <p>{qualification.qualification}</p>
                  </div>
                  <div className="d-block">
                    <span>{qualification.endDate}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to check if a string is a valid JSON
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export default Feedback;