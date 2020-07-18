import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import jwtDecode from "jwt-decode";
import baseURL from "../../baseURL";

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

export const updateToken = async (userPhone) => {
  const response = await axios.get(`${baseURL}/user/updateToken`, {
    params: {
      phone: userPhone,
    },
  });

  if (response.data.success) {
    try {
      const token = response.data.token;
      await AsyncStorage.setItem("@token", token);

      return true;
    } catch (error) {
      console.log("Error with setting updated token: " + error);
      return false;
    }
  } else {
    console.log("Error with retrieving updated token.");
    return false;
  }
};
