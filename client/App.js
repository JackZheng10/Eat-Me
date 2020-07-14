import React, { Component } from "react";
import { Text, View, Platform, Keyboard, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppLoading } from "expo";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
	Friends,
	Sessions,
	Session,
	Settings,
	Login,
	Register,
} from "./src/components";

//!!!dont hardcode positions and sizes, use windowWidth/windowHeight  (see other files for example) whenever possible
//hardcoding should(?) be fine if youre using top/bottom/left/right tho
//with that being said, make sure to test on different sized screens to make sure what we've done with this philosophy works properly

//DOCS:
//bottom navigator docs: https://reactnavigation.org/docs/bottom-tab-navigator/
//stack navigation docs: https://reactnavigation.org/docs/stack-navigator/#props
//navigation prop docs: https://reactnavigation.org/docs/navigation-prop/
//available icons for RNE and as a raw icon (seen in this file): https://icons.expo.fyi/
//color palette: https://coolors.co/f79256-8ed5f5-f5f1ed-00b2ca

//IMPORTANT NOTE: the stack navigator will save the route that you're on. for example:
//-go to settings, then the example stack view, then away, then back, and you'll see youre still in the stacked view
//-this is probably good behavior for our usage, but im sure theres a workaround in the nav. prop or stack nav. docs if needed
//-for default behavior: maybe think of each "stack screen" as its own separate navigation, and the tab navigator as a means to get to that navigation.

//todo:
//probably want header and footer to be the aqua color? idk play with it
//dropshadow to topbar and bottombar?
//in future will need some sort of webhook/listener for updates like friend requests and matches..or firebase's firestore? firebase auth is also interesting

const FriendsStack = createStackNavigator();
const SessionsStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ExampleStack() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Here's an example of how views can "stack"!</Text>
		</View>
	);
}

function FriendsStackScreen() {
	return (
		<FriendsStack.Navigator
			screenOptions={({ route, navigation }) => ({
				// headerShown: false,
				headerTitleAlign: "left",
				headerStyle: { backgroundColor: "#00B2CA" },
				headerTitleStyle: { color: "white" },
				// headerRight: () => {
				//   return (
				//     <MaterialCommunityIcons
				//       name="silverware-fork"
				//       size={30}
				//       color={"white"}
				//       style={{ marginRight: 10 }}
				//     />
				//   );
				// },
			})}
		>
			<FriendsStack.Screen name="Friends" component={Friends} />
			<FriendsStack.Screen name="StackExample" component={ExampleStack} />
		</FriendsStack.Navigator>
	);
}

function SessionsStackScreen() {
	return (
		<SessionsStack.Navigator
			screenOptions={({ route, navigation }) => ({
				// headerShown: false,
				headerTitleAlign: "left",
				headerStyle: { backgroundColor: "#00B2CA" },
				headerTitleStyle: { color: "white" },
			})}
		>
			<SessionsStack.Screen name="Sessions" component={Sessions} />
			<SessionsStack.Screen name="Session" component={Session} />
		</SessionsStack.Navigator>
	);
}

function SettingsStackScreen() {
	return (
		<SettingsStack.Navigator
			screenOptions={({ route, navigation }) => ({
				// headerShown: false,
				headerTitleAlign: "left",
				headerStyle: { backgroundColor: "#00B2CA" },
				headerTitleStyle: { color: "white" },
			})}
		>
			<SettingsStack.Screen name="Settings" component={Settings} />
			<SettingsStack.Screen name="StackExample" component={ExampleStack} />
		</SettingsStack.Navigator>
	);
}

class App extends Component {
	state = { loading: true, keyboardVisible: false };

	//for android, because android. prob still janky. with access to manifest file would be easy. figure out later.
	componentDidMount = () => {
		console.log(Sessions);

		if (Platform.OS !== "android") {
			return;
		}

		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				this.setState({ keyboardVisible: true });
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				this.setState({ keyboardVisible: false });
			}
		);

		//understand better please
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	};

	render() {
		if (!this.state.loading) {
			return (
				<AppLoading
					onFinish={() => this.setState({ loading: false })}
					onError={console.warn}
				/>
			);
		} else {
			return (
				<NavigationContainer>
					<Tab.Navigator
						screenOptions={({ route }) => ({
							tabBarIcon: ({ focused, color, size }) => {
								switch (route.name) {
									case "Friends":
										return (
											<MaterialIcons name="people" size={size} color={color} />
										);

									case "Sessions":
										return (
											<MaterialCommunityIcons
												name="food"
												size={size}
												color={color}
											/>
										);

									case "Settings":
										return (
											<MaterialIcons
												name="settings"
												size={size}
												color={color}
											/>
										);
								}
							},
						})}
						tabBarOptions={{
							activeTintColor: "#F5F1ED",
							inactiveTintColor: "#848482",
							keyboardHidesTabBar: true,
							style: { backgroundColor: "#00B2CA" },
							// style: this.state.keyboardVisible ? { display: "none" } : {},
						}}
						initialRouteName="Friends"
					>
						<Tab.Screen name="Friends" component={FriendsStackScreen} />
						<Tab.Screen name="Sessions" component={SessionsStackScreen} />
						<Tab.Screen name="Settings" component={SettingsStackScreen} />
						<Tab.Screen name="Login" component={Login} />
						<Tab.Screen name="Register" component={Register} />
					</Tab.Navigator>
				</NavigationContainer>
			);
		}
	}
}

export default App;
