'use client';

import { useEffect, useState } from 'react';
import { testFirebaseConnection } from '../../lib/testFirebaseConnection'; // Assuming testFirebaseConnection.ts exists

const FirebaseTestPage = () => {
  const [status, setStatus] = useState('Testing Firebase connection...');

  useEffect(() => {
    const runTest = async () => {
      try {
        await testFirebaseConnection();
        setStatus('Firebase connection successful!');
      } catch (error: any) {
        setStatus(`Firebase connection failed: ${error.message}`);
      }
    };

    runTest();
  }, []);

  return (
    <div>
      <h1>Firebase Connection Test</h1>
      <p>{status}</p>
    </div>
  );
};

export default FirebaseTestPage;