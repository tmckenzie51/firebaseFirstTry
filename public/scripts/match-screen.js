var database = firebase.database(); //database reference

class matchScreen {

  constructor(containerElement) {

    //define constructor params
    this.containerElement = containerElement;


    //functions
    this.getMatches = this.getMatches.bind(this);
    this.calcualteNumberOfMatchingCommunities = this.calcualteNumberOfMatchingCommunities.bind(this);
    this.displayMatches = this.displayMatches.bind(this);
    //this.messageMatch = this.messageMatch.bind(this);

    // const messageButton = document.querySelector('#messageButton');
    // messageButton.addEventListener('click',this.messageMatch);
    document.addEventListener('submitted',this.getMatches);

    }


    getMatches(event){
      event.preventDefault;
      //get currUser's bigCommunity
      const user =  firebase.auth().currentUser;
      var userRef = firebase.database().ref("user-communities");
      userRef.child("communityOne").child(user.uid).orderByChild("bigCommunity").on("value",function(snap){
        console.log('retrieving bigComm');
        console.log(snap.val().bigCommunity);
        var currBigComm = snap.val().bigCommunity;

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
              card.appendChild(cardPic);

              //card action
              const actionDiv = document.createElement('div');
              actionDiv.classList.add('card-action');
              const actionLink = document.createElement('a');
              actionLink.classList.add('messageButton');
              const messageIcon = document.createElement('i');
              messageIcon.classList.add('material-icons');
              messageIcon.textContent = 'message';
              actionLink.textContent = 'Message';
              actionDiv.appendChild(actionLink);
              actionDiv.appendChild(messageIcon);
              card.appendChild(actionDiv);
            })
            })
          });

      });

    }

    calcualteNumberOfMatchingCommunities(){
      console.log('calculating the number of matching communities');
      this.displayMatches();
    }

    displayMatches(data){
      console.log('we did it');
      //get userID from query
    }

    // messageMatch(event){
    //   console.log('messaging match');
    //   const user = firebase.auth().currentUser;
    //
    // }

}
