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
      //todo: maybe something else to handle this null return
      alert("Error with retrieving current user. Please relog and try again.");
      return null;
    }
  } catch (error) {
    console.log("Error with retrieving token: " + error);
    alert("Error with retrieving current user. Please relog and try again.");
    return null;
  }
};

export const updateToken = async (userPhone) => {
  try {
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
        alert("Error with setting updated token. Please relog and try again.");
        return false;
      }
    } else {
      console.log("Error with retrieving updated token.");
      alert("Error with retrieving updated token. Please relog and try again.");
      return false;
    }
  } catch (error) {
    console.log("Error with retrieving updated token: " + error);
    alert("Error with retrieving updated token. Please relog and try again.");
    return false;
  }
};
