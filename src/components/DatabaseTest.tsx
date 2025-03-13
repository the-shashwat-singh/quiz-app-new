import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabase';

const DatabaseTest: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to fetch questions to test the connection
        const questions = await supabaseService.getQuestions();
        setStatus('connected');
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to database');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Database Connection Status</h2>
      {status === 'checking' && (
        <div className="text-blue-600">
          Checking database connection...
        </div>
      )}
      {status === 'connected' && (
        <div className="text-green-600">
          ✓ Database connection successful!
        </div>
      )}
      {status === 'error' && (
        <div className="text-red-600">
          ✗ Database connection failed: {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DatabaseTest; 