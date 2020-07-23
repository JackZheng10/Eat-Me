import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Login, Register } from "./components";

const StartupStack = createStackNavigator();

const Startup = (props) => {
  return (
    <StartupStack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <StartupStack.Screen name="Login">
        {(props) => (
          <Login {...props} handleLoginCheck={props.handleLoginCheck} />
        )}
      </StartupStack.Screen>
      <StartupStack.Screen name="Register" component={Register} />
    </StartupStack.Navigator>
  );
};

export default Startup;
