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
    const storyboardElement = document.getElementById('storyboardScreen');
    this.storyboardScreen = new storyboardScreen(storyboardElement);

    this.showNotification = this.showNotification.bind(this);
    this.findNewMessages = this.findNewMessages.bind(this);
    this.getChildIDs = this.getChildIDs.bind(this);
    this.addNotificationBadge = this.addNotificationBadge.bind(this);
    this.addBadge = this.addBadge.bind(this);
    this.notifCount;
    document.addEventListener('signedIn', this.showNotification);
  }


showNotification(event){
  const currentUser = firebase.auth().currentUser;
  if(currentUser){

    //get signout time
    const userActivityRef = firebase.database().ref('user-activity/'+currentUser.uid+'/signoutTime')
    userActivityRef.orderByChild("signoutTime").once("value",(data)=>{
      const signoutTime = data.val();
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
      this.findNewMessages(signoutTime, childIDs);
  });
}

findNewMessages(signoutTime,childIDs){
  var notifCount = 0;
  //get individual chatIDs

    for(const chat of childIDs){

      //for each chatID / chat, add event listener to listen for new messages
      const chatMessagesRef = firebase.database().ref('/messages/'+chat.chatID);

      chatMessagesRef.on("child_added",(snap)=>{
          const messages = snap.val();
          if(messages.name !== firebase.auth().currentUser.displayName){
            const messageTime = messages.timestamp;
            if((messageTime - signoutTime) >= 0){
              console.log('new message');
              notifCount++
              Materialize.toast('New Message', 4000);
              this.addBadge(notifCount);
            }
          }
          });

    }
}

//todo: for giving notifs to individual convoDivs in inboxScreen
addNotificationBadge(chatid){
  //get the recipientID : ref(user-chats/currentUser.uid/chatId).orderByChild(recipientID) --> data.val().recipientID
  //document.getElementById(recipientID) --> retrieve appropraite convoDiv
  // create badge element: <span class="new badge">4</span>
  //convoDiv.appendChild
  const currentUser = firebase.auth().currentUser;
  const userChatsRef = firebase.database().ref('/user-chats/'+currentUser.uid+'/'+chatid);
  userChatsRef.orderByChild("recipientID").once("value",(data)=>{
    const recipientID = data.val().recipientID;
    this.addBadge(recipientID);
  });
}

addBadge(notifCount){
  const badges = document.getElementsByClassName('messageNotifs');
  for(const badge of badges){
    badge.textContent = notifCount;
  }



//  convoDiv.appendChild(badge);
}


}
