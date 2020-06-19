import React, { Component } from "react";
import { View, Image } from 'react-native';
import {Content, Text} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Swiper from 'react-native-deck-swiper';
import baseURL from "../../baseURL";
import axios from "axios";

class Session extends Component {
  
  state = {
  	Restaraunts: []
  }

  //This should mirror the DB component
  fakeRestaraunt = {
  	Accepted: false,
  	Voted: false,
  	Details : {}
  };

  componentDidMount = () =>{
  	//Practice Startup
  	this.practiceStartup();
  }

  practiceStartup = async () =>{
  	//Get fake restaraunts
  	const sessionRestaraunts = await axios.post(`${baseURL}/yelp/session-restaraunts`, {SessionID: "ID"});
  	this.setState({Restaraunts: sessionRestaraunts.data.businesses});
  }

  onSwipedRight = (index) =>{

  }

  onSwipedLeft = (index) =>{

  }

  renderRestaraunt = (restaraunt, index) =>{
  	
    if(this.state.Restaraunts.length > 0){
	  	return(
	  		<View>
	  			<Text>{restaraunt.name}</Text>
	  			<Image style={{width:50, height:50}} source={{uri: restaraunt.image_url}} />
	  		</View>
	  	);
    }

  }

  //ContentContainerStyle to get appropriate height for box
  render(){
    return(
    	<Content contentContainerStyle={{ flex: 1 }}>
  			<Grid>
  				 <Row size={2} style={{backgroundColor: '#635DB7'}} >
  				 	<Swiper cards={this.state.Restaraunts} 
  				 		renderCard={this.renderRestaraunt}
  				 		verticalSwipe={false}
  				 		onSwipedRight={this.onSwipedRight}
  				 		onSwipedLeft = {this.onSwipedLeft}
  				 		>
  				 	</Swiper>
  				 </Row>
                   <Row size={1} style={{backgroundColor: '#00CE9F'}} >
                   	<Text >No.2</Text>
                   </Row>
  			</Grid>
    	</Content>
    );
  }
}

export default Session;
