var provider = new firebase.auth.FacebookAuthProvider();


//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

class loginScreen {

  constructor(containerElement) {
    this.containerElement = containerElement;
    //retrieve html elements
    const fbButton =  document.querySelector('#fbButton');

    //functions
    this.fbLogin = this.fbLogin.bind(this);
    this.hide = this.hide.bind(this);

    //events
    fbButton.addEventListener('click',this.fbLogin);
  }

fbLogin(event){

  //firebase code:
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log('made it');
  console.log(user);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

this.hide();
}


//hides entire login/signup screen
  hide(){
    var user = firebase.auth().currentUser;
    const communityElement = document.querySelector('#create-community-screen');
    // this.communityScreen  = new createCommunity(communityElement);
    communityElement.classList.remove('inactive');
    this.containerElement.classList.add('inactive');
    }


}
