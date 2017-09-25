class App {
  constructor() {
    const loginElement = document.querySelector('#loginScreen');
    this.login = new loginScreen(loginElement);
    const communityElement = document.querySelector('#create-community-screen');
    this.communityScreen  = new createCommunity(communityElement);
    const matchScreenElement  =  document.querySelector('#match-screen');
    this.matchScreen = new matchScreen(matchScreenElement);
    const messageScreenElement = document.getElementById('messageScreen');
    this.messageScreen = new messageScreen(messageScreenElement);
    const inboxScreenElement = document.getElementById('inboxScreen');
    this.inboxScreen = new inboxScreen(inboxScreenElement);

    this.showNotification = this.showNotification.bind(this);
    this.findNewMessages = this.findNewMessages.bind(this);
    this.getChildIDs = this.getChildIDs.bind(this);
    document.addEventListener('signedIn', this.showNotification);

  }


showNotification(event){
  const currentUser = firebase.auth().currentUser;
  if(currentUser){
    console.log('we have the user to notify');

    //get signout time
    const userActivityRef = firebase.database().ref('user-activity/'+currentUser.uid+'/signoutTime')
    userActivityRef.orderByChild("signoutTime").once("value",(data)=>{
      const signoutTime = data.val();
      console.log('signout time: '+ signoutTime);
      this.getChildIDs(signoutTime);
    });
  }
}

getChildIDs(signoutTime){
  const currentUser = firebase.auth().currentUser;
  const userChatsRef = firebase.database().ref('/user-chats/'+currentUser.uid);
  var childIDs = [];
  userChatsRef.on("child_added",(data)=>{
      childIDs.push(data.val());
      console.log(childIDs);
      this.findNewMessages(signoutTime, childIDs);
  });
}

findNewMessages(signoutTime,childIDs){
  console.log(childIDs);
  //get individual chatIDs

    for(const chat of childIDs){
      console.log(chat.chatID);

      //for each chatID / chat, add event listener to listen for new messages
      const chatMessagesRef = firebase.database().ref('/messages/'+chat.chatID);

      chatMessagesRef.on("child_added",(snap)=>{
          console.log('got message children');
          const messages = snap.val();
          const messageTime = messages.timestamp;
          console.log(messageTime);
          if((messageTime - signoutTime) >= 0){
            console.log('new message');
          }
        });
    }
}

}
