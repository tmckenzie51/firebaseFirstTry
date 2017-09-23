// [START get_messaging_object]
// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// [END get_messaging_object]
// IDs of divs that display Instance ID token UI or request permission UI.
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';



class messageScreen {

  constructor(containerElement) {

    //define constructor params
    this.containerElement = containerElement;


    //functions
    this.startFirebase = this.startFirebase.bind(this);
    document.addEventListener('message',this.startFirebase);


    //functions from quickstart
    this.resetUI = this.resetUI.bind(this);
    this.updateUIForPushEnabled = this.updateUIForPushEnabled.bind(this);
    this.updateUIForPushPermissionRequired = this.updateUIForPushPermissionRequired.bind(this);
    this.clearMessages = this.clearMessages.bind(this);
    this.appendMessage = this.appendMessage.bind(this);
    this.deleteToken = this.deleteToken.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
    this.showHideDiv = this.showHideDiv.bind(this);
    this.setTokenSentToServer = this.setTokenSentToServer.bind(this);
    this.isTokenSentToServer = this.isTokenSentToServer.bind(this);
    this.sendTokenToServer = this.sendTokenToServer.bind(this);
    this.showToken = this.showToken.bind(this);
    }


startFirebase(event){

  // [START refresh_token]
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {

    messaging.getToken()
    .then(function(refreshedToken) {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      var app = this;
      app.setTokenSentToServer(false);

      // Send Instance ID token to app server.
      app.sendTokenToServer(refreshedToken);
      // [START_EXCLUDE]
      // Display new Instance ID token and clear UI of all previous messages.
      app.resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      app.showToken('Unable to retrieve refreshed token ', err);
    });
  });
  // [END refresh_token]
  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a sevice worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    app.appendMessage(payload);
    // [END_EXCLUDE]
  });
  // [END receive_message]
  this.resetUI();
}

    resetUI() {
    this.clearMessages();
    this.showToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        var app = this;
        console.log(currentToken);
        app.sendTokenToServer(currentToken);
        app.updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        app.updateUIForPushPermissionRequired();
        app.setTokenSentToServer(false);
      }
    })
    .catch(function(err) {
      var app = this;
      console.log('An error occurred while retrieving token. ', err);
      app.showToken('Error retrieving Instance ID token. ', err);
      app.setTokenSentToServer(false);
    });
  }
  // [END get_token]


   showToken(words,currentToken) {
    // Show token in console and UI.
    var tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
  }

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
   sendTokenToServer(currentToken) {
     var app = this;
    if (!app.isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      app.setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }

isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
  }

  setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
  }

   showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = "display: visible";
    } else {
      div.style = "display: none";
    }
  }

 requestPermission() {
   var app = this;
    console.log('Requesting permission...');
    // [START request_permission]
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      app.resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
  }

   deleteToken() {
     var app = this;
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken()
    .then(function(currentToken) {
      messaging.deleteToken(currentToken)
      .then(function() {
        console.log('Token deleted.');
        app.setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        app.resetUI();
        // [END_EXCLUDE]
      })
      .catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    })
    .catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
      app.showToken('Error retrieving Instance ID token. ', err);
    });
  }

  // Add a message to the messages element.
   appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;'
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
  }

  // Clear the messages element of all children.
 clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }

   updateUIForPushEnabled(currentToken) {
    this.showHideDiv(tokenDivId, true);
    this.howHideDiv(permissionDivId, false);
    this.showToken(currentToken);
  }

   updateUIForPushPermissionRequired() {
    this.howHideDiv(tokenDivId, false);
    this.showHideDiv(permissionDivId, true);
  }



}
