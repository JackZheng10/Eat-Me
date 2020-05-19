import React, { Component } from "react";
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import Friends from "./src/components/Friends";
import Sessions from  "./src/components/Sessions"
import Settings from "./src/components/Settings";

const Views = {
  Sessions: { Title: "Sessions",
              View: <Sessions/>
            },
  Friends: { Title: "Friends",
              View: <Friends/>
            },
  Settings: { Title: "Settings",
              View: <Settings/>
            }
}

class App extends Component {
  
  state = {
    CurrentView: Views.Sessions
  }

  switchView = (view) =>{
    this.setState({CurrentView: view});
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
                <Button active={this.setActiveState(Views.Friends.Title)} onPress={()=>this.switchView(Views.Friends)}>
                  <Icon name="person" />
                </Button>
                <Button active={this.setActiveState(Views.Sessions.Title)} onPress={()=>this.switchView(Views.Sessions)}>
                  <Icon name="pie" />
                </Button>
                <Button active={this.setActiveState(Views.Settings.Title)} onPress={()=>this.switchView(Views.Settings)}>
                  <Icon name="settings" />
                </Button>
              </FooterTab>
          </Footer>
        </Container>
    );
  }
}

export default App;
