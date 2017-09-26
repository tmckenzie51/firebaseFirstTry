var database = firebase.database(); //database reference

class matchScreen {

  constructor(containerElement) {

    //define constructor params
    this.containerElement = containerElement;


    //functions
    this.getMatches = this.getMatches.bind(this);
    this.calcualteNumberOfMatchingCommunities = this.calcualteNumberOfMatchingCommunities.bind(this);
    this.displayMatches = this.displayMatches.bind(this);
    this.getBigCommunity = this.getBigCommunity.bind(this);

    document.addEventListener('submitted',this.getBigCommunity);

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

    this.navigateToCreateCommunityScreen = this.navigateToCreateCommunityScreen.bind(this);
    const createCommunityButtons = document.getElementsByClassName('createCommunityButton');
    for(const button of createCommunityButtons){
      button.addEventListener('click',this.navigateToCreateCommunityScreen);
    }

    }

    navigateToCreateCommunityScreen(event){
      this.containerElement.classList.add('inactive');
      const communityScreenElement = document.getElementById('create-community-screen');
      communityScreenElement.classList.remove('inactive');
    }

    navigate(event){
      this.containerElement.classList.add('inactive');
    }

    getBigCommunity(event){
      event.preventDefault;
      var currBigComm = null;
      var innerComm1 = null;
      var innerComm2 = null;
      var innerComm3 = null;
      //get currUser's bigCommunity
      const user =  firebase.auth().currentUser;
      var userRef = firebase.database().ref("user-communities/communityOne/"+user.uid);

      //get BigCommunity of currentUser
      var currUserInnerCommArray = [];
      userRef.orderByChild("bigCommunity").on("value",(snap)=>{
        currBigComm = snap.val().bigCommunity;
        innerComm1 = snap.val().innerComm1;
        innerComm2 = snap.val().innerComm2;
        innerComm3 = snap.val().innerComm3;
        currUserInnerCommArray.push(innerComm1);
        currUserInnerCommArray.push(innerComm2);
        currUserInnerCommArray.push(innerComm3);
        this.getMatches(currBigComm,currUserInnerCommArray);
      });
    }


    getMatches(currBigComm,currUserInnerCommArray){
      const cardContainer = document.getElementById('cardContainer');
      cardContainer.innerHTML ='';
        //get matches based on currentUser's bigCommunity
        var ref = firebase.database().ref("user-communities/communityOne");
        var matchesArray = [];
        ref.orderByChild("bigCommunity").equalTo(currBigComm).on("child_added",(data)=>{
          const matchID =  data.ref.getKey();
          matchesArray.push(matchID);
          this.calcualteNumberOfMatchingCommunities(matchesArray,currBigComm,currUserInnerCommArray);
          });
    }


    calcualteNumberOfMatchingCommunities(matchesArray,currBigComm,currUserInnerCommArray){

      //this.displayMatches(); //todo: this should be called at the end of this function

      //calculate the number of matching communities
      for(var match of matchesArray){

        //retrive the inner-communities of match
        var matchInnerCommArray = [];
        var userRef = firebase.database().ref("user-communities/communityOne/"+match);
        userRef.orderByChild("bigCommunity").on("value",(snap)=>{
          const innerComm1 = snap.val().innerComm1;
          const innerComm2 = snap.val().innerComm2;
          const innerComm3 = snap.val().innerComm3;
          matchInnerCommArray.push(innerComm1);
          matchInnerCommArray.push(innerComm2);
          matchInnerCommArray.push(innerComm3);
        });

        //initialize the number of similar calcualteNumberOfMatchingCommunities
        var matchingCommArr =[currBigComm];

        for(const innerComm of currUserInnerCommArray){
          for(const matchInnerComm of matchInnerCommArray){
            if(innerComm === matchInnerComm){
              matchingCommArr.push(innerComm);
            }
          }
        }

        //clean array
        var newMatchingCommArray = new Array();
        for (var i = 0; i < matchingCommArr.length; i++) {
          if (matchingCommArr[i]) {
            newMatchingCommArray.push(matchingCommArr[i]);
          }
        }

      }
      this.displayMatches(match,newMatchingCommArray,currUserInnerCommArray.length);

    }

    displayMatches(matchID,matchingInnerCommArr,NumOfInnerComms){


      //for each match -  get profile Info - use userID to query for userName and profile profile_picture
        const profileRef = firebase.database().ref("users/"+matchID);

        profileRef.orderByChild("email").on("value",(snapshot)=>{
          const userProfileInfo = snapshot.val();
          var name = userProfileInfo.username;
          var pictureSource = userProfileInfo.profile_picture;

      if(matchID === firebase.auth().currentUser.uid){
        return;
      }else{
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


      //card action
      const actionLink = document.createElement('a');
      actionLink.classList.add('messageButton', 'btn-floating', 'halfway-fab', 'waves-effect', 'waves-light', 'blue');
      const messageIcon = document.createElement('i');
      messageIcon.classList.add('material-icons');
      messageIcon.textContent = 'message';
      actionLink.appendChild(messageIcon);
      cardPic.appendChild(actionLink);
      actionLink.id = matchID; //todo: do i need to give this element an id?
      actionLink.addEventListener("click",function(){
        //switch to messaging screen
        const messageScreen = document.getElementById('messageScreen');
        const matchScreen =  document.getElementById('match-screen');
        matchScreen.classList.add('inactive');
        messageScreen.classList.remove('inactive');
        //fire custom event in message screen
        const myEvent = new CustomEvent('message',{detail: matchID});
        document.dispatchEvent(myEvent);
      });
      card.appendChild(cardPic);

      const cardContent = document.createElement('div');
      const message = document.createElement('p');
      message.textContent = 'You match based on '+matchingInnerCommArr.length + ' out of '+ NumOfInnerComms+ ' communities - '+  matchingInnerCommArr + '.';
      cardContent.appendChild(message);
      card.appendChild(cardContent);
    }
    });
    }

    messageMatch(event){
      const user = firebase.auth().currentUser;

    }


}
