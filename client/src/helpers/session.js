import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import jwtDecode from "jwt-decode";
import baseURL from "../../baseURL";

export const getCurrentUser = async () => {
  try {
    const value = await AsyncStorage.getItem("@token");

    if (value !== null) {
      const data = jwtDecode(value);
      //todo: verify the token beforehand
      return data;
    } else {
      //todo: maybe something else to handle this null return. depends on the context this is usually used in
      //todo: possible combine w/getStored by returning object with property and token
      alert("Error with retrieving current user. Please relog and try again.");
      return null;
    }
  } catch (error) {
    console.log("Error with retrieving token: " + error);
    alert("Error with retrieving current user. Please relog and try again.");
    return null;
  }
};

export const getStoredLogin = async () => {
  try {
    const value = await AsyncStorage.getItem("@token");

    if (value !== null) {
      //todo: verify token
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error with retrieving token: " + error);
    alert("Error with checking for logged in user. Please try again.");
    return false;
  }
};

//should use whenever a change to the user is made in the db, so the frontend always has the updated JWT
//todo: maybe use socket.io for this..?
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
        console.log("Error with setting updated token: ", error);
        alert("Error with setting updated token. Please relog and try again.");
        return false;
      }
    } else {
      console.log("Error with updating token: ", response.data.message);
      alert("Error with updating token. Please relog and try again.");
      return false;
    }
  } catch (error) {
    console.log("Error with updating token: ", error);
    alert("Error with updating token. Please relog and try again.");
    return false;
  }
};
