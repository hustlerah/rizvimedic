import { auth, db, storage } from '@/backend/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClipLoader } from 'react-spinners';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';

function Profile() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFullName, setNewFullName] = useState('');
  const [newbloodType, setNewBloodType] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('myBooking');
  const [imagePreview, setImagePreview] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    let redirected = false; // Added variable to track redirection
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoggedIn(!!user);
  
      if (user && !redirected) {
        const data = await fetchDataForCurrentUser();
        if (data) {
          setUserData(data);
  
          // Check user role and redirect accordingly
          if (data[0].role === 'doctor') {
            router.push('/doctor/profile'); // Adjust the route accordingly
          } else {
            console.log('')
          }
  
          // Set the redirected variable to true after the first redirection
          redirected = true;
        } else {
          console.log('No user is signed in.');
        }
      }
    });
  
    return () => unsubscribe();
  }, [router]);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      router.push('/user/login');
    } catch (error) {
      console.error('Sign-out Error:', error.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchDataForCurrentUser();
        if (data) {
          setUserData(data);
        } else {
          console.log('No user is signed in.');
        }
      } finally {
        setLoading(false);
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
  
      return data.length > 0 ? data : null; // Check if data is not empty
    } else {
      return null;
    }
  }
  

  const handleFullNameChange = (e) => {
    const inputValue = e.target.value;
    setNewFullName(inputValue === '' ? '' : inputValue);
  };

  const handleBloodTypeChange = (e) => {
    setNewBloodType(e.target.value);
  };
// ... (your existing imports)

// Add import for storage functions if not already present
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const handleUpdateProfile = async (e) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if (user) {
      try {
        let updatedProfilePic = newProfilePic; // Use let instead of const
  
        // Handle file upload separately, assuming you have a storage reference
        if (newProfilePic) {
          const storageRef = ref(storage, 'profile_pics/' + user.uid);
          await uploadBytes(storageRef, newProfilePic);
          const photoURL = await getDownloadURL(storageRef);
          // Update the photoURL field in the Firestore document
          updatedProfilePic = photoURL;
        }
  
        const userRef = doc(db, 'users', userData[0].id);
        const updateData = {
          FullName: newFullName || userData[0].FullName,
          bloodType: newbloodType || userData[0].bloodType,
          photoURL: updatedProfilePic || userData[0].photoURL, // Use the updated variable
        };
  
        await updateDoc(userRef, updateData);
  
        console.log('Profile updated successfully');
        alert('Profile updated successfully');
        setNewFullName('');
        setNewBloodType('');
        setNewProfilePic(null);
      } catch (error) {
        console.error('Error updating profile', error);
      }
    }
  };
  
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePic(file);
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  
    // Generate a preview for the selected image
   
  };
  const notify = () => toast.success("Updated Succesfully");
  return (
    <>
      <div className="Profile Login">
      <ToastContainer/>

        <div className="container">
          <div className="row">
            <div className="col-md-6">
              {loading ? (
               <div className="df"> <ClipLoader color="#36D7B7" loading={loading} size={30} /></div>
              ) : (
                userData.map((user) => (
                  <div key={user.id} className="df">
                    <div className="profileimg">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile Pic"
                          className="img-fluid pfimg"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="profile-pic "
                          size='3x'
                        />
                      )}
                    </div>
                    <p className="mt-2">Email: {user.email}</p>
                    <p className="mt-1">
                      Blood Type: {user.bloodType ? user.bloodType : 'None'}
                    </p>
                    <button
                      className="btn btn-dark w-50 mt-5"
                      onClick={handleSignOut}
                    >
                      Logout
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="col-md-6  mt-3">
              <div className="d-flex">
                <button
                  className={`pfbtn ${activeTab === 'myBooking' ? 'active' : ''}`}
                  onClick={() => handleTabChange('myBooking')}
                >
                  My Booking
                </button>
                <button
                  className={`pfbtn ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => handleTabChange('settings')}
                >
                  Settings
                </button>
              </div>

              <div className="tab-content">
                <div className={`tab-pane ${activeTab === 'myBooking' ? 'active' : ''}`}>
                  <div className="mt-4">
                    <h4>My Bookings</h4>
                  </div>
                </div>

                <div className={`tab-pane ${activeTab === 'settings' ? 'active' : ''}`}>
                  <div className="inp-form">
                    <h3>Profile <span>Settings</span></h3>
                    <form>
                      {userData.map((user) => (
                        <div key={user.id}>
                          <div className="inp mt-3">
                            <input
                              type="text"
                              placeholder={user.FullName}
                              id="fullName"
                              value={newFullName}
                              onChange={handleFullNameChange}
                            />
                          </div>
                          <div className="inp mt-2">
                            <input
                              type="text"
                              placeholder="Email"
                              id="email"
                              value={user.email}
                              disabled
                            />
                          </div>
                          <div className="inp mt-2">
                            <input
                              type="text"
                              placeholder={user.bloodType ? user.bloodType : 'None'}
                              id="bloodType"
                              value={newbloodType}
                              onChange={handleBloodTypeChange}
                            />
                          </div>
                          {/* <span>{user.role}</span> */}
                          <div className="d-fle df1">
                  <div className="mt-3 inp ">
                    <label htmlFor="fileInput" className="btnpr">
                      Upload Photo
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      className="btnpr"
                      name="photo"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                    />
                  </div> 
                         {imagePreview && (
                    <div className="mt-3 mx-2">
                      <img src={imagePreview} alt="Image Preview" style={{ width: '50px', height: '50px',borderRadius:'40px' }} />
                    </div>
                  )}
                  </div>
                       <div className="df" style={{width:'430px'}}>
                       <button className='btns w-100 mt-3' onClick={handleUpdateProfile}>Update</button>
                       </div>
                        </div>
                      ))}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
