import React, { Component } from "react";
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
//import { NavigationContainer } from '@react-navigation/native';
import Friends from "./src/components/Friends";
import Sessions from  "./src/components/Sessions"
import Settings from "./src/components/Settings";

class App extends Component {
  
  //Need to organize this class much better
  switchView = (view) =>{
    this.setState({CurrentView: view});
  }

  Views = {
    Sessions: { 
                Title: "Sessions",
                View: <Sessions switchView={this.switchView}/>
              },
    Friends: { 
                Title: "Friends",
                View: <Friends/>
              },
    Settings: { 
                Title: "Settings",
                View: <Settings/>
              }
  }

  state = {
    CurrentView: this.Views.Sessions
  }
  
  setActiveState = (viewTitle) =>{
    let activeState  = false;
    if(viewTitle == this.state.CurrentView.Title){
      activeState = true;
    }
    return activeState;
  }

  render(){
    return(
          <Container>
            <Header />
            
            {this.state.CurrentView.View}
            
            <Footer>
                <FooterTab>
                  <Button active={this.setActiveState(this.Views.Friends.Title)} onPress={()=>this.switchView(this.Views.Friends)}>
                    <Icon name="person" />
                  </Button>
                  <Button active={this.setActiveState(this.Views.Sessions.Title)} onPress={()=>this.switchView(this.Views.Sessions)}>
                    <Icon name="pie" />
                  </Button>
                  <Button active={this.setActiveState(this.Views.Settings.Title)} onPress={()=>this.switchView(this.Views.Settings)}>
                    <Icon name="settings" />
                  </Button>
                </FooterTab>
            </Footer>
          </Container>
    );
  }
}

export default App;
