
import { useEffect, useState } from 'react';
import APIs, { endpoints } from '../Config/APIs';
import { useNotification } from '../Context/Notification';

const VerifyEmail = () =>{
   const [message, setMessage] = useState('');
   const params = new URLSearchParams(window.location.search);
   const token = params.get('token');
   const {showNotification} = useNotification()

   const verifyEmail = async (token:string) => {
    try {
      const response = await APIs.post(`${endpoints.verifyEmail}`, {
        token: token
      })
      if (response.status === 200) {
        setMessage(response.data.message);
        showNotification(response.data.message, 'success')
      }

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
