import { auth, db, storage } from '@/backend/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClipLoader } from 'react-spinners';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where,arrayUnion  } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
// ... (your existing imports)

function Profile() {
    const [userData, setUserData] = useState([]);
    const [selectedQualificationIndex, setSelectedQualificationIndex] = useState(null);
const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(null);

    const [loading, setLoading] = useState(true);
    const [newFullName, setNewFullName] = useState('');
    const [newbloodType, setNewBloodType] = useState('');
    const [newProfilePic, setNewProfilePic] = useState(null);
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('tab1'); // Set the default active tab here
    const [about,setAbout] = useState('')
    const [imagePreview, setImagePreview] = useState(null);
   // Separate states for each field in qualificationData
   const [qualificationStartDate, setQualificationStartDate] = useState('');
   const [qualificationEndDate, setQualificationEndDate] = useState('');
   const [qualificationName, setQualificationName] = useState('');
 
   // Separate states for each field in experienceData
   const [experienceStartDate, setExperienceStartDate] = useState('');
   const [experienceEndDate, setExperienceEndDate] = useState('');
   const [experienceJobTitle, setExperienceJobTitle] = useState('');
   const [experienceCompany, setExperienceCompany] = useState('');
   const [showQualificationForm, setShowQualificationForm] = useState(false);
   const [showExperienceForm, setShowExperienceForm] = useState(false);
 
   const toggleQualificationForm = () => {
     setShowQualificationForm(!showQualificationForm);
     // Hide experience form when showing qualification form
     setShowExperienceForm(false);
   };
 
   const toggleExperienceForm = () => {
     setShowExperienceForm(!showExperienceForm);
     // Hide qualification form when showing experience form
     setShowQualificationForm(false);
   };
 
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  const handleQualificationSubmit = async (e) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', userData[0].id);
        const qualificationData = {
          startDate: qualificationStartDate,
          endDate: qualificationEndDate,
          qualification: qualificationName,
        };
  
        // Add the qualification data to the 'qualifications' array field in Firestore
        await updateDoc(userRef, {
          qualifications: arrayUnion(qualificationData),
        });
  
        // After saving, hide the qualification form
        setShowQualificationForm(false);
  
        console.log('Qualification added successfully');
        alert('Qualification added successfully');
  
        // Clear qualification form fields if needed
        setQualificationStartDate('');
        setQualificationEndDate('');
        setQualificationName('');
      } catch (error) {
        console.error('Error adding qualification', error);
      }
    }
  };const handleEditQualification = async () => {
    // Update the existing qualification using selectedQualificationIndex
    // Update Firestore document accordingly
    // Clear form fields and reset state variables
    setSelectedQualificationIndex(null);
    setQualificationStartDate('');
    setQualificationEndDate('');
    setQualificationName('');
  };
  
  const handleEditExperience = async () => {
    // Update the existing experience using selectedExperienceIndex
    // Update Firestore document accordingly
    // Clear form fields and reset state variables
    setSelectedExperienceIndex(null);
    setExperienceStartDate('');
    setExperienceEndDate('');
    setExperienceJobTitle('');
    setExperienceCompany('');
  };
  
  
  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', userData[0].id);
        const experienceData = {
          startDate: experienceStartDate,
          endDate: experienceEndDate,
          jobTitle: experienceJobTitle,
          company: experienceCompany,
        };
  
        // Add the experience data to the 'experiences' array field in Firestore
        await updateDoc(userRef, {
          experiences: arrayUnion(experienceData),
        });
  
        // After saving, hide the experience form
        setShowExperienceForm(false);
  
        console.log('Experience added successfully');
        alert('Experience added successfully');
  
        // Clear experience form fields if needed
        setExperienceStartDate('');
        setExperienceEndDate('');
        setExperienceJobTitle('');
        setExperienceCompany('');
      } catch (error) {
        console.error('Error adding experience', error);
      }
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



  const handleAboutchange = (e) => {
    setAbout(e.target.value);
  };


  const handleFullNameChange = (e) => {
    const inputValue = e.target.value;
    setNewFullName(inputValue === '' ? '' : inputValue);
  };

  const handleBloodTypeChange = (e) => {
    setNewBloodType(e.target.value);
  };
// ... (your existing imports)
const handleexperinceStTypeChange = (e) => {
  setExperienceStartDate(e.target.value);
};
const handleexperinceEtTypeChange = (e) => {
  setExperienceEndDate(e.target.value);
};
const handleexperinceTitleChange = (e) => {
  setExperienceJobTitle(e.target.value);
};
const handleexperinceCompanyChange = (e) => {
  setExperienceCompany(e.target.value);
};
const handleQualificationStartDate = (e) => {
  setQualificationStartDate(e.target.value);
};
const handleQualificationEndDate = (e) => {
  setQualificationEndDate(e.target.value);
};
const handleQualificationName = (e) => {
  setQualificationName(e.target.value);
};
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
          about: about || userData[0].about, // Use the updated variable
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
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      router.push('/user/login');
    } catch (error) {
      console.error('Sign-out Error:', error.message);
    }
  };
  return (
    <>
   
      <div className="Profile Login DFR">
        <div className="container">
          <div className="row">
            <div className="col-md-4 d Dpr">
              <div className="tb shadow-lg d-flex align-items-center">
                <div className={`tab-button mt-1 ${activeTab === 'tab1' ? 'active' : ''}`} onClick={() => handleTabClick('tab1')}>
                  Overview
                </div>
                <div className={`tab-button mt-1 ${activeTab === 'tab2' ? 'active' : ''}`} onClick={() => handleTabClick('tab2')}>
                  Appointments
                </div>
                <div className={`tab-button mt-1 ${activeTab === 'tab3' ? 'active' : ''}`} onClick={() => handleTabClick('tab3')}>
                  Setting
                </div>
                <div className="mt-5 ">
                    <button className='btn btn-dark ' onClick={handleSignOut}>Logout</button>
                </div>
              </div>
            </div>
            <div className="col-md-8">
            {activeTab === 'tab1' && (
  <div>
    {userData.map((user) => (
      <div className="d-flex align-items-start justify-content-start" key={user.id}>
        <div className="df1">
          <img src={user.photoURL} alt={user.FullName} className="img-fluid" style={{ width: '200px', height: '200px' }} />
          <h4 className='mx-2' style={{color:'#111111',fontSize:'15px'}}>{user.FullName}</h4>
        </div>
        <h6 className='mt-3'>About of <span> {user.FullName}</span></h6>
        <div className="abt w-75">
            <p className='text-break'>{user.about}</p>
        </div>
        <h6 className="mt-3">Experience</h6>
        {user.experiences && user.experiences.map((experience, index) => (
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
                      <h6 className="mt-3">Qualification</h6>
                      {user.qualifications && user.qualifications.map((qualification, index) => (
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
    ))}
  </div>
)}

              {activeTab === 'tab2' && <div>Tab 2 Content</div>}
              {activeTab === 'tab3' && (
                <div>
                    <div className="inp">
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
                          <div className="d-flex df4">
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
                  <div className="mt-3 w-50">
                    <label htmlFor="about">About</label>
                    <textarea name="about" id='About' className='form-control' value={about} onChange={handleAboutchange}></textarea>
                  </div>
                       <div className="df" style={{width:'430px'}}>
                       <button className='btns w-100 mt-3' onClick={handleUpdateProfile}>Update</button>
                       </div>
                        </div>
                      ))}
                    </form>
                  </div>
                    </div>
                    <div className="row d-flex align-items-start">
        <div className="col-md-6 mb-3">
          <button className="btn btn-primary" onClick={toggleQualificationForm}>
            Add Qualification
          </button>
          {showQualificationForm && (
             <div>
              <h3>{selectedQualificationIndex !== null ? 'Edit' : 'Add'} <span>Qualification</span></h3>
    
             <form>
               <div className="mb-3">
                 <label htmlFor="qualificationStartDate" className="form-label">
                   Starting Year:
                 </label>
                 <input type="text" className="form-control" placeholder='Starting Year' id="qualificationStartDate" name="startDate" onChange={handleQualificationStartDate} value={qualificationStartDate}/>
               </div>
               <div className="mb-3">
                 <label htmlFor="qualificationEndDate" className="form-label">
                   Ending Date:
                 </label>
                 <input type="text" className="form-control" placeholder='Ending Year' id="qualificationEndDate" name="endDate" onChange={handleQualificationEndDate} value={qualificationEndDate}/>
               </div>
               <div className="mb-3">
                 <label htmlFor="qualificationName" className="form-label">
                   Qualification:
                 </label>
                 <input type="text" className="form-control" id="qualificationName" name="qualification" onChange={handleQualificationName} value={qualificationName}/>
               </div>
               <button type="button" className="btn btn-success" onClick={selectedQualificationIndex !== null ? handleEditQualification : handleQualificationSubmit}>
        {selectedQualificationIndex !== null ? 'Update' : 'Save'}
      </button>
             </form>
           </div>
          )}
        </div>
        <div className="col-md-6">
          <button className="btn btn-primary" onClick={toggleExperienceForm}>
            Add Experience
          </button>
          {showExperienceForm && (
          <div>
          <h3>{selectedExperienceIndex !== null ? 'Edit' : 'Add'} <span>Experience</span></h3>
          <form>
            <div className="mb-3">
              <label htmlFor="experienceStartDate" className="form-label">
              Starting Year:
              </label>
              <input type="text" className="form-control" placeholder='Starting Year' id="experienceStartDate" name="startDate" onChange={handleexperinceStTypeChange} value={experienceStartDate}/>
            </div>
            <div className="mb-3">
              <label htmlFor="experienceEndDate" className="form-label">
                Ending Year:
              </label>
              <input type="text" className="form-control" placeholder='Ending Year' id="experienceEndDate" name="endDate" onChange={handleexperinceEtTypeChange} value={experienceEndDate}/>
            </div>
            <div className="mb-3">
              <label htmlFor="experienceJobTitle" className="form-label">
                Job Title:
              </label>
              <input type="text" className="form-control" id="experienceJobTitle" name="jobTitle" onChange={handleexperinceTitleChange} value={experienceJobTitle}/>
            </div>
            <div className="mb-3">
              <label htmlFor="experienceCompany" className="form-label">
                Company:
              </label>
              <input type="text" className="form-control" id="experienceCompany" name="company" onChange={handleexperinceCompanyChange} value={experienceCompany}/>
            </div>
            <button type="button" className="btn btn-success" onClick={selectedExperienceIndex !== null ? handleEditExperience : handleExperienceSubmit}>
        {selectedExperienceIndex !== null ? 'Update' : 'Save'}
      </button>
          </form>
        </div>
          )}
        </div>
      </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
