import axios from "axios";
import baseURL from "../../baseURL";

//getUsersByID usage:
//-expects an array of user ids, repititions dont matter (i believe)
//returns an array of users, only containing their phone #, first name, last name, and ID (can be changed if needed)
//-where you use this, you have the handle the success or fail returned
//-ex:
/*
fetchFriends = async () => {
    let currentUser = await getCurrentUser();

    const users = await this.fetchUsersByID(currentUser.friends);

    //if successful, update the friends list
    if (users.success) {
      this.setState({ friends: users.message });
    } else { //if not, show the error msg
      alert(users.message);
    }
  };
*/
export const getUsersByID = async (list) => {
  try {
    const response = await axios.post(`${baseURL}/user/getUsersByID`, {
      list,
    });

    return { success: response.data.success, message: response.data.message };
  } catch (error) {
    console.log("Error with getting user list from IDs: ", error);
    return {
      success: false,
      message: "Error with getting user list from IDs. Please contact us.",
    };
  }
};
