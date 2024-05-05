


import React, { useEffect } from 'react';
import Preloader from '@/components/Preloader';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import '../styles/globals.css'; // Import your global styles
import '@/styles/Preloader.css'; // Import your global styles
import '@/styles/Navbar.css'; 
import '@/styles/Hero.css'; 
import '@/styles/Works.css'; 
import '@/styles/About.css'; 
import '@/styles/Services.css'; 
import '@/styles/Featured.css'; 
import '@/styles/Register.css'; 
import '@/styles/login.css'; 
import '@/styles/Profile.css'; 
import '@/styles/DProfile.css'; 
import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';
import NextNProgress from 'nextjs-progressbar';
import Navbar from '@/components/Navbar';
import Aos from 'aos';
import styled from '@emotion/styled';
import { Provider } from 'react-redux';
import store from '@/redux/store';

// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

    // Initialize aos with your desired options
    Aos.init({
      duration: 1000, 
      once: true, 
    });
  }, []);

  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    // Simulate a delay, replace this with your actual data fetching or page loading logic
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(delay);
  }, []);

  // Show the preloader for 2 seconds before navigating to the new route
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);

      // Simulate a delay before showing the preloader
      const delay = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(delay);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <Provider store={store}>
    <div>
      {loading ? (
        <>
        
        <Preloader />
        </>
      ) : (
        <>
        <Navbar/>
          <Component {...pageProps} />
        </>
      )}
    </div>
    </Provider>
  );
}

export default MyApp; 