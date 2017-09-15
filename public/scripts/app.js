class App {
  constructor() {
    const loginElement = document.querySelector('#loginScreen');
    this.login = new loginScreen(loginElement);
    const communityElement = document.querySelector('#create-community-screen');
    this.communityScreen  = new createCommunity(communityElement);
    const matchScreenElement  =  document.querySelector('#match-screen');
    this.matchScreen = new matchScreen(matchScreenElement);
  }
 }
