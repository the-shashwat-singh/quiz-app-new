interface Session {
  regNumber: string;
  deviceId: string;
  timestamp: number;
}

// Get a unique device identifier
export const generateDeviceId = (): string => {
  // Check if we already have a device ID
  let deviceId = localStorage.getItem('deviceId');
  
  // If not, create a new one
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};

// Create or update a session
export const createSession = (regNumber: string): string => {
  const deviceId = generateDeviceId();
  const timestamp = Date.now();
  
  // Get existing sessions
  const sessions = getSessions();
  
  // Check if this student already has a session on another device
  const existingSession = sessions.find(s => s.regNumber === regNumber && s.deviceId !== deviceId);
  
  if (existingSession) {
    // Remove the existing session
    const updatedSessions = sessions.filter(s => !(s.regNumber === regNumber && s.deviceId !== deviceId));
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
  }
  
  // Add or update the current session
  const currentSession = sessions.find(s => s.deviceId === deviceId);
  
  if (currentSession) {
    currentSession.regNumber = regNumber;
    currentSession.timestamp = timestamp;
  } else {
    sessions.push({ regNumber, deviceId, timestamp });
  }
  
  // Save sessions
  localStorage.setItem('sessions', JSON.stringify(sessions));
  
  return deviceId;
};

// Get all active sessions
export const getSessions = (): Session[] => {
  const sessionsData = localStorage.getItem('sessions');
  if (!sessionsData) return [];
  
  try {
    return JSON.parse(sessionsData);
  } catch (error) {
    console.error('Error parsing sessions data:', error);
    return [];
  }
};

// Check if a session is valid
export const validateSession = (regNumber: string): boolean => {
  const deviceId = localStorage.getItem('deviceId');
  if (!deviceId) return false;
  
  const sessions = getSessions();
  const session = sessions.find(s => s.regNumber === regNumber);
  
  // No session found for this registration number
  if (!session) return false;
  
  // Check if this is the same device
  return session.deviceId === deviceId;
};

// Remove a session
export const removeSession = (regNumber: string): void => {
  const sessions = getSessions();
  const updatedSessions = sessions.filter(s => s.regNumber !== regNumber);
  localStorage.setItem('sessions', JSON.stringify(updatedSessions));
};

// Clean up expired sessions (older than 24 hours)
export const cleanupSessions = (): void => {
  const sessions = getSessions();
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  const activeSessions = sessions.filter(s => now - s.timestamp < oneDayMs);
  localStorage.setItem('sessions', JSON.stringify(activeSessions));
}; 