import Link from 'next/link';
import { auth, db, storage } from '@/backend/firebase';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import * as Yup from 'yup'; // Import Yup for validation
import { ToastContainer, toast } from 'react-toastify';

import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect } from 'react';

const validationSchema = Yup.object({
  name: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.string().required('Role is required'),
  gender: Yup.string().required('Gender is required'),
});

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to home page
        router.push('/user/profile');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const selectedImage = e.target.files[0];
    setPhoto(selectedImage);
  
    // Display image preview
    if (selectedImage) {
      setImagePreview(URL.createObjectURL(selectedImage));
    } else {
      setImagePreview(null);
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Validation
      await validationSchema.validate(
        {
          name,
          email,
          password,
          role,
          gender,
        },
        { abortEarly: false }
      );

      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Upload photo to Firebase Storage
      let photoURL = null;
      if (photo) {
        const fileName = `${uid}_${photo.name}`;
        const storageRef = ref(storage, `profile_pics/${fileName}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }
      // Add user data to Firestore
      const userCollection = collection(db, 'users');
      const userDocRef = await addDoc(userCollection, {
        uid: uid,
        FullName: name,
        email: email,
        gender: gender,
        role: role,
        photoURL: photoURL,
        bloodType: 'None',
        about:"",
        

      });
      notify();
      if (role === 'doctor') {
        router.push('/doctor/profile');
      } else if (role === 'pateint') {
        router.push('/user/profile'); // Redirect doctor to the doctor's profile route
        return; // Add this return statement to prevent further execution
      }
    } catch (error) {
      console.error('Registration Error:', error.message);

      if (error instanceof Yup.ValidationError) {
        // Handle Yup validation errors
        const validationErrors = {};
        error.inner.forEach((innerError) => {
          validationErrors[innerError.path] = innerError.message;
        });
        setError(validationErrors);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
    
};
const notify = () => toast.success("Register Succesfully");
  return (
    <>
      <div className="Register ">
        <ToastContainer/>
        <div className="container">
          <div className="row df">
            <div className="col-md-6">
              <img src="/assets/images/signup.gif" alt="Register" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <div className="form-bg">
                <h2 className="mt-2">
                  Create an <span>Account</span>
                </h2>
                <form>
                  <div className="inp mt-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={handleNameChange} />
                  </div>
                  <div className="inp mt-2">
                    <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                  </div>
                  <div className="inp mt-2">
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                  </div>
                  <div className="d-flex mt-3">
                    <div className="d-flex align-items-center">
                      <h6 className="mx-2">Are you a</h6>
                      <select id="fruitSelect" name="fruit" value={role} onChange={handleRoleChange}>
                      <option value={'Selet Role'} disabled >Select Role</option>
                        <option value={'patient'}>Patient</option>
                        <option value={'doctor'}>Doctor</option>
                      </select>
                    </div>
                    <div className="d-flex align-items-center">
                      <h6 className="mx-2">Gender</h6>
                      <select id="gender" name="gender" value={gender} placeholder='Select Gender' onChange={handleGenderChange}>
                      <option value={'Select Gender'} disabled>Select Gender</option>
                        <option value={'male'}>Male</option>
                        <option value={'female'}>Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex df1">
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
                      onChange={handlePhotoChange}
                    />
                  </div>
                        {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="Image Preview" style={{ width: '50px', height: '50px',borderRadius:'40px' }} />
                    </div>
                  )}
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {typeof error === 'string' ? (
                        <p>{error}</p>
                      ) : (
                        <ul>
                          {Object.values(error).map((errorMsg, index) => (
                            <li key={index}>{errorMsg}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  <button className="btns w-100 mt-3" onClick={handleRegister}>
                    Register
                  </button>
                  <div className="mt-3 text-center">
                    <p>
                      Already Have an Account? <Link href={'/'}><span>Login</span></Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
