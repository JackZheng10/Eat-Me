import AsyncStorage from "@react-native-community/async-storage";
import jwtDecode from "jwt-decode";

export const getCurrentUser = async () => {
  try {
    const value = await AsyncStorage.getItem("@token");

    if (value !== null) {
      const data = jwtDecode(value);
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error with retrieving token: " + error);
    return null;
  }
};
