var provider = new firebase.auth.FacebookAuthProvider();


//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

class loginScreen {

  constructor(containerElement) {
    this.containerElement = containerElement;
    //retrieve html elements
    const fbButton =  document.querySelector('#fbButton');

    //functions
    this.fbLogin = this.fbLogin.bind(this);
    this.navigateToMatchScreen = this.navigateToMatchScreen.bind(this);
    this.navigateToCreatCommunityScreen = this.navigateToCreatCommunityScreen.bind(this);
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
  firebase.auth().signInWithPopup(provider).then((result) =>{
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log(user);
  // ...
}).catch((error) =>{
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

firebase.auth().onAuthStateChanged((user)=> {
  if (user) {
    console.log('user signed in');

    event.preventDefault();
    const user = firebase.auth().currentUser;

    //First check if user already exists
    const userRef = firebase.database().ref('/users/'+user.uid);
    userRef.once("value",(data)=>{
      var exists = (data.val() !== null );
      console.log(exists);
      if(exists){
        this.navigateToMatchScreen();
      }else{
        this.navigateToCreatCommunityScreen(user);
      }
    });
  } else {
    // No user is signed in.
    console.log('no user signed in');
  }
});
}

navigateToMatchScreen(){
  //else save user and send welcome message from Community


  const matchScreenElement = document.getElementById('match-screen');
  matchScreenElement.classList.remove('inactive');
  const navBar =  document.getElementById('header');
  navBar.classList.remove('inactive');
  const loginElement = document.querySelector('#loginScreen');
  loginElement.classList.add('inactive');

  const myEvent = new CustomEvent('signedIn');
  document.dispatchEvent(myEvent); //dispatces to app.js in order to listen for new messages
  const myEvent2 = new CustomEvent('submitted');
  document.dispatchEvent(myEvent2); //dispatches to match screen

}

navigateToCreatCommunityScreen(user){
  //save user and send welcome message from Community
      firebase.database().ref('users/' + user.uid).set({
        username: user.displayName,
        email: user.email,
        profile_picture : user.photoURL,
      });

      //register community as a user //todo: will actually re-register for every new user
      firebase.database().ref('users/12345').set({
        username: 'Community',
        email: 'welcome2community@gmail.com',
        profile_picture : "http://www.webster.edu/images/globalmarketingcommunications/diversity-tree-2014.png",
      });

      const communityElement = document.querySelector('#create-community-screen');
      communityElement.classList.remove('inactive');
      const navBar =  document.getElementById('header');
      navBar.classList.remove('inactive');
      const loginElement = document.querySelector('#loginScreen');
      loginElement.classList.add('inactive');

      const myEvent = new CustomEvent('signedIn');
      document.dispatchEvent(myEvent); //dispatces to app.js in order to listen for new messages
}



}
