'use strict';
//todo: change 'friendlychat' everywhere
//todo: chage firebase image in folder and find out where it si referenced here


//todo: 1st function

// Initializes FriendlyChat.


class messageScreen {

  constructor(containerElement) {

    //define constructor params
    this.containerElement = containerElement;


    //Get DOM Elements
    this.messageList = document.getElementById('messages');
    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message');
    this.submitButton = document.getElementById('submit');
    this.submitImageButton = document.getElementById('submitImage');
    this.imageForm = document.getElementById('image-form');
    this.mediaCapture = document.getElementById('mediaCapture');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');


    // Saves message on form submit.
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);

    // Events for image upload.
    this.submitImageButton.addEventListener('click', function(e) {
      e.preventDefault();
      this.mediaCapture.click();
    }.bind(this));
    this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

    //custom event test functions
    this.testing = this.testing.bind(this);
    document.addEventListener('message',this.testing());



    //functions from FriendlyChat example
    this.loadMessages = this.loadMessages.bind(this);
    this.saveMessage = this.saveMessage.bind(this);

    }


    // Loads chat messages history and listens for upcoming ones.
    loadMessages() {
      // Reference to the /messages/ database path.
     this.messagesRef = this.database.ref('messages'); //todo: check if this path exaists in my database or if i'll have to manually add it?
     // Make sure we remove all previous listeners.
     this.messagesRef.off();

     // Loads the last 12 messages and listen for new ones.
     var setMessage = function(data) {
       var val = data.val();
       this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
     }.bind(this);
     this.messagesRef.limitToLast(12).on('child_added', setMessage);
     this.messagesRef.limitToLast(12).on('child_changed', setMessage);
    }

    // Saves a new message on the Firebase DB.
    saveMessage (event) {
      event.preventDefault();
        // Check that the user entered a message and is signed in.
        if (this.messageInput.value && this.checkSignedInWithMessage()) {
          var currentUser = this.auth.currentUser;
          // Add a new message entry to the Firebase Database.
          this.messagesRef.push({
            name: currentUser.displayName,
            text: this.messageInput.value,
            photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
          }).then(function() {
            // Clear message text field and SEND button state.
            FriendlyChat.resetMaterialTextfield(this.messageInput);
            this.toggleButton();
          }.bind(this)).catch(function(error) {
            console.error('Error writing new message to Firebase Database', error);
          });
        }
    }



}






// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
FriendlyChat.prototype.setImageUrl = function(imageUri, imgElement) {
  imgElement.src = imageUri;

  // If the image is a Cloud Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
};

//todo: function but like a line of code: find a different way to get image here
// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
FriendlyChat.prototype.saveImageMessage = function(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }

  // Check if the user is signed-in
   if (this.checkSignedInWithMessage()) {

     // We add a message with a loading icon that will get updated with the shared image.
     var currentUser = this.auth.currentUser;
     this.messagesRef.push({
       name: currentUser.displayName,
       imageUrl: FriendlyChat.LOADING_IMAGE_URL,
       photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
     }).then(function(data) {

       // Upload the image to Cloud Storage.
       var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
       return this.storage.ref(filePath).put(file).then(function(snapshot) {

         // Get the file's Storage URI and update the chat message placeholder.
         var fullPath = snapshot.metadata.fullPath;
         return data.update({imageUrl: this.storage.ref(fullPath).toString()});
       }.bind(this));
     }.bind(this)).catch(function(error) {
       console.error('There was an error uploading a file to Cloud Storage:', error);
     });
   }
 }; //todo: end of function line


//todo: maybe don't need this since already signing in earlier in  community -- change

// Signs-in Friendly Chat.
FriendlyChat.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

//todo: don't need this because can be handled otherwise with community app
// Signs-out of Friendly Chat.
FriendlyChat.prototype.signOut = function() {
  // Sign out of Firebase.
   this.auth.signOut();
};

//todo: check to handle differently for community
// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL; // Only change these two lines!  //todo: check that it is referencing the correct user information
    var userName = user.displayName;   // Only change these two lines!

//todo: change th epic and username stuff here for community

    // We load currently existing chant messages.
    this.loadMessages();

    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
FriendlyChat.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) { //todo: change this for community
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Saves the messaging device token to the datastore.
FriendlyChat.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid); //todo: check if this would still work for community
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
};

// Requests permissions to show notifications.
FriendlyChat.prototype.requestNotificationsPermissions = function() {
  console.log('Requesting notifications permission...');
 firebase.messaging().requestPermission().then(function() {
   // Notification permission granted.
   this.saveMessagingDeviceToken();
 }.bind(this)).catch(function(error) {
   console.error('Unable to get permission to notify.', error);
 });
};

// Resets the given MaterialTextField.
FriendlyChat.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
FriendlyChat.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

//todo: check if this applies here
// A loading image URL.
FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
FriendlyChat.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }

  //todo: check out pic stuff here
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  //todo: check out name stuff here
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
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
FriendlyChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// // Checks that the Firebase SDK has been correctly setup and configured.
// FriendlyChat.prototype.checkSetup = function() {
//   if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
//     window.alert('You have not configured and imported the Firebase SDK. ' +
//         'Make sure you go through the codelab setup instructions and make ' +
//         'sure you are running the codelab using `firebase serve`');
//   }
// };
//
// window.onload = function() {
//   window.friendlyChat = new FriendlyChat();
// };
