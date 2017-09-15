var database = firebase.database(); //database reference

class matchScreen {

  constructor(containerElement) {

    //define constructor params
    this.containerElement = containerElement;


    //functions
    this.getMatches = this.getMatches.bind(this);
    this.calcualteNumberOfMatchingCommunities = this.calcualteNumberOfMatchingCommunities.bind(this);
    this.displayMatches = this.displayMatches.bind(this);
    this.messageMatch = this.messageMatch.bind(this);

    const messageButton = document.querySelector('#messageButton');
    messageButton.addEventListener('click',this.messageMatch);

    }


    getMatches(event){
      console.log('got matches');
    }

    calcualteNumberOfMatchingCommunities(){
      console.log('calculating the number of matching communities');
    }

    displayMatches(){
      console.log('displaying matches');
    }

    messageMatch(event){
      console.log('messaging match');
      const user = firebase.auth().currentUser; //only use where necessary. note: don't use this in the constructor is screen is being declared i app.js

    }

}
