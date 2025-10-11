import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import GuestNav from "./GuestNav"
import AdminNav from "./AdminNav"
import DefaultNav from "./DefaultNav"

const Nav = ({ userRole, setCurrentPage }) => {
  switch(userRole) {
    case 'guest':
      return <GuestNav setCurrentPage={setCurrentPage} />;
    case 'admin':
      return <AdminNav setCurrentPage={setCurrentPage} />;
    default:
      return <DefaultNav setCurrentPage={setCurrentPage} />;
  }
};
export default Nav;

