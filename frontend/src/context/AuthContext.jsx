import React, { createContext, useReducer, useContext } from 'react';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  userRole: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).is_admin
      ? 'admin'
      : 'user'
    : null,
  token: localStorage.getItem('access_token') || null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('access_token', action.payload.token);
      if (action.payload.refresh) {
        localStorage.setItem('refresh_token', action.payload.refresh);
      }
      localStorage.setItem('user', JSON.stringify(action.payload.user));

      return {
        ...state,
        user: action.payload.user,
        userRole: action.payload.user.is_admin ? 'admin' : 'user',
        token: action.payload.token,
      };

    case 'LOGOUT':
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return { ...state, user: null, userRole: null, token: null };

    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

