import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const element = useRoutes(routes);

  return (
    <AuthProvider>
      {element}
    </AuthProvider>
  );
}
