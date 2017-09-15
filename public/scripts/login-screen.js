var provider = new firebase.auth.FacebookAuthProvider();


//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

class loginScreen {

  constructor(containerElement) {
    this.containerElement = containerElement;
    //retrieve html elements
    const fbButton =  document.querySelector('#fbButton');

    //functions
    this.fbLogin = this.fbLogin.bind(this);

    //events
    fbButton.addEventListener('click',this.fbLogin);


// this.hideNav = this.hideNav.bind(this);
// this.containerElement.addEventListener('click',this.hideNav);

  }
  //
  // hideNav(event){
  //   console.log('clicked cocntainer element');
  //    $('.button-collapse').sideNav('hide');
  // }

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

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('user signed in');

    //hides entire login/signup screen
    const communityElement = document.querySelector('#create-community-screen');
    const navBar =  document.getElementById('header');
    navBar.classList.remove('inactive');
    communityElement.classList.remove('inactive');
    const loginElement = document.querySelector('#loginScreen');
    loginElement.classList.add('inactive');

    //save user information upon login
    console.log('got user to be entered into database');
    event.preventDefault();
    const user = firebase.auth().currentUser;
        firebase.database().ref('users/' + user.uid).set({
          username: user.displayName,
          email: user.email,
          profile_picture : user.photoURL,
        });
      console.log('saved user in database with empty communities');
  } else {
    // No user is signed in.
    console.log('no user signed in');
  }
});

}



}
