var database = firebase.database(); //database reference

class matchScreen {

  constructor(containerElement) {

    //define constructor params
    this.containerElement = containerElement;


    //functions
    this.getMatches = this.getMatches.bind(this);
    this.calcualteNumberOfMatchingCommunities = this.calcualteNumberOfMatchingCommunities.bind(this);
    this.displayMatches = this.displayMatches.bind(this);

    document.addEventListener('submitted',this.getMatches);

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

    }

    navigate(event){
      this.containerElement.classList.add('inactive');
    }



    getMatches(event){
      event.preventDefault;
      var currBigComm = null;
      //get currUser's bigCommunity
      const user =  firebase.auth().currentUser;
      var userRef = firebase.database().ref("user-communities");

      userRef.child("communityOne").child(user.uid).orderByChild("bigCommunity").on("value",function(snap){
        currBigComm = snap.val().bigCommunity;

        var ref = firebase.database().ref("user-communities");
        ref.child("communityOne").orderByChild("bigCommunity").equalTo(currBigComm).on("value",function(data){
          data.forEach(function(data){
            //use userID to query for userName and profile profile_picture
            const profileRef = firebase.database().ref("users");
            const userID = data.key;
            profileRef.child(userID).orderByChild("email").on("value",function(snapshot){
              const userProfileInfo = snapshot.val();
              var name = userProfileInfo.username;
              var pictureSource = userProfileInfo.profile_picture;

              //use name and picture to make match card
              const cardContainer = document.getElementById('cardContainer');
              cardContainer.innerHTML = '';
              const card = document.createElement('div');
              card.classList.add('card');
              cardContainer.appendChild(card);

              //picture and name display
              const cardPic = document.createElement('div');
              cardPic.classList.add('card-image');
              const image = document.createElement('img');
              image.src = pictureSource;
              cardPic.appendChild(image);
              const nameDisplay = document.createElement('span');
              nameDisplay.classList.add('card-title');
              nameDisplay.textContent = name;
              cardPic.appendChild(nameDisplay);


              //card action
              const actionLink = document.createElement('a');
              actionLink.classList.add('messageButton', 'btn-floating', 'halfway-fab', 'waves-effect', 'waves-light', 'blue');
              const messageIcon = document.createElement('i');
              messageIcon.classList.add('material-icons');
              messageIcon.textContent = 'message';
              actionLink.appendChild(messageIcon);
              cardPic.appendChild(actionLink);
              actionLink.id = userID; //todo: do i need to give this element an id?
              actionLink.addEventListener("click",function(){
                //switch to messaging screen
                const messageScreen = document.getElementById('messageScreen');
                const matchScreen =  document.getElementById('match-screen');
                matchScreen.classList.add('inactive');
                messageScreen.classList.remove('inactive');
                //fire custom event in message screen
                const myEvent = new CustomEvent('message',{detail: userID});
                document.dispatchEvent(myEvent);
              });
              card.appendChild(cardPic);

              const cardContent = document.createElement('div');
              const message = document.createElement('p');
              message.textContent = "Here's a message about myself and interests along with some fun facts. I love going for hikes, biking and spending time with friends. I'm looking to meet awesome people on here with similar interests";
              cardContent.appendChild(message);
              card.appendChild(cardContent);

            })
            })
          });

      });

    }

    calcualteNumberOfMatchingCommunities(){
      console.log('calculating the number of matching communities');
      //this.displayMatches();
    }

    displayMatches(data){
      console.log('we did it');
    }

    messageMatch(event){
      console.log('messaging match');
      const user = firebase.auth().currentUser;

    }

}
