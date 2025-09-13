// 라이브러리
import { login } from './auth'
import { useState, useReducer, useEffect, createContext, useContext, useMemo} from 'react';


function reducer(state, action) {
  switch (action.type) {
    case "INIT_START":
      return { ...state, loading: true };
    case "INIT_DONE":
      return { user: action.payload, loading: false };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false };
    case "LOGOUT":
      return { user: null, loading: false };
    default:
      return state;
  }
}

export default function AuthProvider() {
    <div>AuthProvider</div>
}
