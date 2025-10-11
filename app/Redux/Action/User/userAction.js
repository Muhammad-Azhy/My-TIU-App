import Types from "../../Types.json";

export const setUser = (userData) => {
  return {
    type: Types.User.SET_USER,
    payload: userData,
  };
};

export const clearUser = () => {
  return {
    type: Types.User.CLEAR_USER,
  };
};

// Set user role (e.g., 'student', 'lecturer', 'admin', 'guest')
export const setUserRole = (role) => {
  return {
    type: Types.User.SET_ROLE,
    payload: role,
  };
};
