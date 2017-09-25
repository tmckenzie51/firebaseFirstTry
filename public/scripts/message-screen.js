'use strict';

const messaging  = firebase.messaging();
//var storage = firebase.storage();

class messageScreen {

  constructor(containerElement){
    this.containerElement = containerElement;

    // Shortcuts to DOM Elements.
    this.messageList = document.getElementById('messages');
    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message');
    this.submitButton = document.getElementById('submit');
    this.mediaCapture = document.getElementById('mediaCapture');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');


    this.loadMessages = this.loadMessages.bind(this);
    this.saveMessagingDeviceToken = this.saveMessagingDeviceToken.bind(this);
    this.checkSignedInWithMessage = this.checkSignedInWithMessage.bind(this);
    this.requestNotificationsPermissions = this.requestNotificationsPermissions.bind(this);
    this.resetMaterialTextfield = this.resetMaterialTextfield.bind(this);
    this.displayMessage= this.displayMessage.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
    this.checkSetup = this.checkSetup.bind(this);
    this.saveMessage = this.saveMessage.bind(this);
    this.getCurrentChatId = this.getCurrentChatId.bind(this);
    this.retieveChatIDToSaveMessage = this.retieveChatIDToSaveMessage.bind(this);


    // Template for messages.
    this.MESSAGE_TEMPLATE =
        '<div class="message-container">' +
          '<div class="spacing"><div class="pic"></div></div>' +
          '<div class="message"></div>' +
          '<div class="name"></div>' +
        '</div>';

    // A loading image URL.
    this.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

    // Saves message on form submit.
    this.messageForm.addEventListener('submit', this.retieveChatIDToSaveMessage);

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton;
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);

    this.testing = this.testing.bind(this);
    document.addEventListener('message',this.testing);

    //todo: organize this
    this.navigate = this.navigate.bind(this);
    const signOutButtons =  document.getElementsByClassName('signOutButton');
    for(const button of signOutButtons){
      button.addEventListener('click',this.navigate);
    }
    const inboxButtons =  document.getElementsByClassName('messagesButton');
    for(const button of inboxButtons){
      button.addEventListener('click',this.navigate);
    }
    const storyboardButtons = document.getElementsByClassName('storyboardButton');
    for(const button of storyboardButtons){
      button.addEventListener('click',this.navigate);
    }
    const matchButtons = document.getElementsByClassName('matchesButton');
    for(const button of matchButtons){
      button.addEventListener('click',this.navigate);
    }


  }

  navigate(event){
    this.containerElement.classList.add('inactive');
  }



  testing(event){
    this.recipientID = event.detail;
    this.database = firebase.database();
    this.currentUser = firebase.auth().currentUser;


    //get user name to display Name as header for message box
    const profileRef = this.database.ref("users");
    const userID = this.recipientID;
    profileRef.child(userID).orderByChild("email").once("value",(snapshot)=>{
      const userProfileInfo = snapshot.val();
      const name = userProfileInfo.username;
      const profilePic = userProfileInfo.profile_picture;
      const recipientNameHeader = document.getElementById("recipientNameHeader");
      const recipientPictureHeader = document.getElementById("recipientPictureHeader");
      recipientPictureHeader.src = profilePic;
      recipientNameHeader.textContent = name;
    });


    this.checkSetup();
    this.getCurrentChatId()
    this.saveMessagingDeviceToken();
  }

  getCurrentChatId(){
    //get chatID from user-chats
    var userChatsRef = this.database.ref('user-chats/' + this.currentUser.uid);
    userChatsRef.orderByChild("recipientID").equalTo(this.recipientID).on("value",(snapshot)=>{
      if(snapshot.val()){
        snapshot.forEach((data)=>{
          this.loadMessages(data.val().chatID);
        });
      }else{
        this.loadMessages(null);
      }
    });
  }

// Loads chat messages history and listens for upcoming ones.
  loadMessages(currentChatId) {
  // Reference to the /messages/ database path.
  this.messagesRef = this.database.ref('messages');
  var currentChatMessagesReference = null;
  if(currentChatId){
    currentChatMessagesReference = this.database.ref('messages/'+currentChatId);
  }else{
    this.newchatId = firebase.database().ref().child('chat-messages').push().key;
    currentChatMessagesReference =  this.database.ref('messages/'+this.newchatId);
  }

  //todo
  // Make sure we remove all previous listeners.
  //currentChatMessagesReference.off(); //todo: check if we really wanna turn this off


    //while in the match screen 'child_added' counts as every single child that has ever been added.
    //maybe fix this by writing /user-activity/currentUser.uid/signoutTime = timestamp
      // if (messages/chatID).on(child_added) --> data.val().timestamp

      //only execute rest of the function under condition that this message screen is not active
        //use document.active element


  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data){
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  currentChatMessagesReference.limitToLast(12).on('child_added',setMessage);
  currentChatMessagesReference.limitToLast(12).on('child_added',setMessage);
}

retieveChatIDToSaveMessage(event){
  //get chatID from user-chats
  var currentUserChatsRef = this.database.ref('user-chats/' + this.currentUser.uid);
  currentUserChatsRef.orderByChild("recipientID").equalTo(this.recipientID).once("value",(snapshot)=>{
    if(snapshot.val()){
      snapshot.forEach((data)=>{
        this.saveMessage(data.val().chatID);
      });
    }else{
      this.saveMessage(null);
    }

  });
}

// Saves a new message on the Firebase DB.
  saveMessage(chatid) {
  event.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var timestamp = 0 - Math.floor(Date.now() / 1000);
    var updates = {};
    //check if this person already exists as a chat recipient
      if(!chatid){
        //create new chatID key and add to database
        this.newChatRef = firebase.database().ref('user-chats/'+this.currentUser.uid+'/'+this.newchatId);
        this.newChatRef2 = firebase.database().ref('user-chats/'+this.recipientID+'/'+this.newchatId);

        //add recipient to list of inbox convos for current user
        this.newChatRef.set({
          recipientID: this.recipientID,
          timestamp: timestamp ,
          chatID: this.newchatId
        });
        //add currentUser to list of inbox convos for recipent
        this.newChatRef2.set({
          recipientID: this.currentUser.uid ,
          timestamp: timestamp ,
          chatID: this.newchatId
        });

        let currentChatMessagesReference = this.database.ref('messages/'+this.newchatId);
        this.pushMessages(currentChatMessagesReference,timestamp);
      }else{
        //update timestamp for this current user
        var chatData = {
          recipientID: this.recipientID,
          timestamp:timestamp ,
          chatID: chatid
        }

        //update timestamp for other chat Participant
        var chatData2 = {
          recipientID : this.currentUser.uid ,
          timestamp:timestamp ,
          chatID: chatid
        }

        updates[ '/user-chats/' + this.currentUser.uid +'/' + chatid] = chatData; //update timestamp on current user convo with recipient
        updates['/user-chats/' + this.recipientID +'/' + chatid] = chatData2; //update timestamp on recipient convo with currentUser

        // Add a new message entry to the Firebase Database.
        let currentChatMessagesReference = this.database.ref('messages/'+chatid);
        this.pushMessages(currentChatMessagesReference,timestamp);
        return firebase.database().ref().update(updates);
      }
    }
  }

pushMessages(chatRef,timestamp){
  // Add a new message entry to the Firebase Database.
  const time = ( timestamp * -1 );
  chatRef.push({
    name: this.currentUser.displayName,
    text: this.messageInput.value,
    photoUrl: this.currentUser.photoURL || '/images/profile_placeholder.png' ,
    timestamp: time
  }).then(function() {
    // Clear message text field and SEND button state.
    this.resetMaterialTextfield(this.messageInput);
    this.toggleButton();
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}



// Returns true if user is signed-in. Otherwise false and displays a message.
checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (firebase.auth().currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Saves the messaging device token to the datastore.
saveMessagingDeviceToken() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
requestNotificationsPermissions() {
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
}

// Resets the given MaterialTextField.
resetMaterialTextfield(element) {
  element.value = '';
  //element.parentNode.MaterialTextfield.boundUpdateClassesHandler(); //todo: fix this bug - .MaterialTextfield undefined
}

// Displays a Message in the UI.
displayMessage(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = this.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    //this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
toggleButton() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}


}
