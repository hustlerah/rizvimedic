import { auth } from '@/backend/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import * as Yup from 'yup'; // Import Yup for validation
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
          setError('');
    
          // Validation
          await validationSchema.validate({
            email,
            password,
          });
    
          // Firebase Authentication
          await signInWithEmailAndPassword(auth, email, password);
          notify()
          router.push('/user/profile')

          // Redirect the user or update state as needed
        //   router.push('/');
        } catch (error) {
          console.error('Login Error:', error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
    
      const handleEmailChange = (e) => {
        setEmail(e.target.value);
      };
    
      const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };
      const notify = () => toast.success("Login Succesfully");

  return (
    <>
    <div className="Login ">
        <ToastContainer/>
        <div className="container df ">
           <div className="login-bg shadow-lg">
           <h2>Hi! <span>Welcome </span>Back</h2>
            <form >
            
            <div className="inp mt-4">
                    <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                  </div>
                  <div className="inp mt-2">
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                  </div>
                  <button className="btns w-100 mt-3" onClick={handleLogin}>
                    Login
                  </button>
                  <div className="mt-3 text-center">
                    <p>
                      Don't Have an Account? <Link href={'/user/register'}><span>Register</span></Link>
                    </p>
                  </div>
            </form>
           </div>
        </div>
    </div>
    </>
  )
}

export default Login