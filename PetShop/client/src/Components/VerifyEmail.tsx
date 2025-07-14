
import { useEffect, useState } from 'react';
import APIs, { endpoints } from '../Config/APIs';

const VerifyEmail = () =>{
   const [message, setMessage] = useState('');
   const params = new URLSearchParams(window.location.search);
   const token = params.get('token');

   const verifyEmail = async (token:string) => {
    try {
      const response = await APIs.post(`${endpoints.verifyEmail}`, {
        token: token
      })
      if (response.status === 200) setMessage("Email verified successfully!");

    } catch (error) {
        console.error("Verification failed:", error);
        setMessage("Verification failed or token expired.")
    }
   }

  useEffect(() => {
    verifyEmail(token || '')
  }, [token]);

  return <div>{message}</div>;
}
export default VerifyEmail
