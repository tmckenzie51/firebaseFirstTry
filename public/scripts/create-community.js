//add the on authStateChanged method here, for when you want ot load previous communities
//also trigger method when user signs out

//handling user signout with authStateChanged method
//if (sign in is Verified) {

//Todo Later : load user's previous communities (perhaps use onAuthStateChanged here)
//}

//Todo: signoutBtn.addEventListener('click',this.singout / onAuthStateChanged);


//var provider = new firebase.auth.GoogleAuthProvider(); //todo: ques - do we need this to be redeclared in this class?

var database = firebase.database(); //database reference

let scaleFactor = 4;
let currentY = null; //currentY stays constant throughout the entire screen

  class createCommunity {

    constructor(containerElement) {
      //define cosntructor params
      this.containerElement = containerElement;

      //array declarations
      this.user = firebase.auth().currentUser;
      this.selectedCommunities = [];
      this.wellnessSuggestions = ['Mental', 'Insurance', 'Fitness','+','Mental', 'Insurance', 'Fitness','+'];
      this.academicsSuggestions = ['Science', 'Humanities', 'Arts','+','Science', 'Humanities', 'Arts','+',];
      this.RelationshipSuggestions = ['Romantic', 'Break-up', 'Family','+','Romantic', 'Break-up', 'Family','+'];
      this.hobbiesSuggestions = ['Cycling','Basketball','Poetry','+','Cycling','Basketball','Poetry','+'];
      this.suggestions = [this.wellnessSuggestions,this.academicsSuggestions,this.RelationshipSuggestions,this.hobbiesSuggestions];
      this.colors=['pink','aquamarine','MediumPurple', 'YellowGreen'];
      this.bigCommunities = document.getElementsByClassName('bigCommunity');


      //function definitions
      this.selectBigCommunity = this.selectBigCommunity.bind(this);
      this.displaySuggestions = this.displaySuggestions.bind(this);
      this.chooseInnerCommunities = this.chooseInnerCommunities.bind(this);
      this.createDoneButton = this.createDoneButton.bind(this);
      this.createStartOverButton = this.createStartOverButton.bind(this);
      this.saveCommunity = this.saveCommunity.bind(this);
      this.hide = this.hide.bind(this);
      this.removeCommunity = this.removeCommunity.bind(this);
      this.startOver = this.startOver.bind(this);

      //add event listeners
      for (const bigCommunity of this.bigCommunities){
          bigCommunity.addEventListener('click',this.selectBigCommunity);
      }

      if (this.user !== null) {
        console.log('got user');
        //can also get proiverID : using profile.providerId
        this.name = this.user.displayName;
        console.log(this.name);
        this.email = this.user.email;
        this.photoUrl = this.user.photoURL;
        //this.emailVerified = this.user.emailVerified;
        this.uid = this.user.uid; //or we can use user.getToken
        console.log(this.uid);
      }

      const header = document.querySelector('#create-community-screen h4');
      const text = 'Welcome '+this.name+'!';
      header.textContent=text;
      }

    //Allows user to select a wide/first community
    selectBigCommunity(event){
      this.createStartOverButton();
      $('#communityCreator h5').remove();
      const bigCommunity = event.currentTarget;
      const firstCommunity = bigCommunity.textContent;
      this.selectedCommunities.push(firstCommunity.trim());

      currentY = event.clientY;

      //creating and styling the concentratic communities
      const id = '#comm'+this.selectedCommunities.length;
      console.log('innercomm id : '+ id);
      const innercomm = document.querySelector(id);
      innercomm.textContent = firstCommunity.trim();
      innercomm.style.top ='calc(38vh + ' +currentY+'px)';
      innercomm.style.transform = 'scale('+scaleFactor+','+scaleFactor+')';
      innercomm.style.color = this.colors[scaleFactor];
      innercomm.style.background = 'orange';

      //create chips
      const chipsContainer = document.querySelector('#chipsInnerContainer');
      const button = document.createElement('div');
      const commName = document.createElement('p');
      button.appendChild(commName);
      button.textContent = firstCommunity.trim();
      button.classList.remove('inactive');
      button.classList.add('chip','removeButton')
      chipsContainer.appendChild(button);

      innercomm.id = firstCommunity.trim();
      innercomm.classList.remove('inactive');
      scaleFactor --;

      //show inner community suggestions and remove big communities from screen
      for (let i = 0; i < this.bigCommunities.length; i++) {
        this.bigCommunities[i].style.display = 'none';  //todo: change this to add inactive classList
        if(this.bigCommunities[i].textContent.trim() === firstCommunity.trim()){
          this.displaySuggestions(this.suggestions[i]); //to display the correct suggestions
      }
    }
      //change user instructions in header
      const header = document.querySelector('#create-community-screen h5');
      header.textContent = ('Choose your inner communities and click "Done" when your Community is just right for you!');
    }

  //displays suggested inner communities
  displaySuggestions(suggestions){
    const suggestionId = document.querySelector('#bigCommInnerContainer');
    for(const suggestion of suggestions ){
      const suggestionDiv = document.createElement('div');
      suggestionDiv.id = 'suggestionDiv';
      suggestionDiv.classList.add('innerCommSuggestions');
      suggestionDiv.addEventListener('click', this.chooseInnerCommunities);
      const text = document.createTextNode(suggestion);
      suggestionDiv.appendChild(text);
      suggestionDiv.style.display = 'inline-block';
      suggestionId.appendChild(suggestionDiv);
    }

  }

  //allows user to choose an innner community
  chooseInnerCommunities(event){
    if(scaleFactor === 3){
      this.createDoneButton();
    }

    //limits user to selecting 4 communities overall
    if(scaleFactor < 1){
      const limitMessage = document.createElement('p');
      limitMessage.textContent = 'You may not add that many communities';
      this.containerElement.appendChild(limitMessage);
      return;
    }


    const innerCommunity = event.currentTarget;
    innerCommunity.removeEventListener('click', this.chooseInnerCommunities);
    const community = innerCommunity.textContent;
    this.selectedCommunities.push(community);

    //inner community styling
    const innercomm = document.querySelector('#comm'+this.selectedCommunities.length)
    innercomm.textContent = community; //maybe change back to innercomm
    innercomm.style.top ='calc(38vh + ' +currentY+'px)';
    innercomm.style.transform = 'scale('+scaleFactor+','+scaleFactor+')';
    innercomm.style.color = this.colors[scaleFactor];
    innercomm.style.background = this.colors[scaleFactor + 1];

    //create chip
    const chipsContainer = document.querySelector('#chipsInnerContainer');
    const button = document.createElement('div');
    const commName = document.createElement('p');
    button.appendChild(commName);
    button.textContent = community;
    button.addEventListener('click',this.removeCommunity);
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('close', 'material-icons');
    closeIcon.textContent = 'close';
    button.appendChild(closeIcon);
    button.classList.remove('inactive');
    button.classList.add('chip', 'removeButton'); //added removebutton here to match selectBigComm
    chipsContainer.appendChild(button);

    innercomm.id = community; //todo :  fix this --> causing errors in redo step when startover clicked
    innercomm.classList.remove('inactive');
    scaleFactor --;
    console.log(this.selectedCommunities);
  }

  removeCommunity(event){

    //remove the community with the corresponding name

    //remove bad concentric community
    const badCommText = event.currentTarget.textContent; //returns commName+'close'
    var  badCommName= badCommText.replace(/close/i,'');
    const badComm = document.getElementById(badCommName); //need to remove the 'close' at the end of badcomm
    badComm.classList.add('inactive');

    //remove badCommunity from selectedCommunities
    var search_term = badCommName;
    for (var i=this.selectedCommunities.length-1; i>=0; i--) {
      if (this.selectedCommunities[i] === search_term) {
        this.selectedCommunities.splice(i, 1);
        break;
      }
    }
    console.log(this.selectedCommunities);
  }

  //creates done button
  createDoneButton(){
    const btn = document.createElement('button');
    btn.textContent = 'Done';
    btn.classList.add('col','s10','offset-s8','btn','waves-effect','waves-light',);
    const doneDiv = document.createElement('div');
    doneDiv.appendChild(btn);
    doneDiv.id = 'doneButton';
    this.containerElement.appendChild(doneDiv);
  }

  createStartOverButton(){
    const btn = document.createElement('button');
    btn.textContent = 'Start Over';
    btn.classList.add('col','s10','offset-s8','btn','waves-effect','waves-light');
    const startOverDiv = document.createElement('div');
    startOverDiv.appendChild(btn);
    startOverDiv.id = 'startOverButton';
    startOverDiv.addEventListener('click',this.startOver);
    this.containerElement.appendChild(startOverDiv);
  }

  startOver(event){
    //makes all concentric communities display = none / inactive
    for(var i = 0; i < this.selectedCommunities.length; i++){
      const commName = this.selectedCommunities[i];
      const badComm = document.getElementById(commName);
      badComm.classList.add('inactive'); //removes concentric comunity from the screen
    }

    //rename ID of all innerComms to what they were in the beginning
    const firstConcentricComm = document.getElementById(this.selectedCommunities[0]);
    let counter = 1;
    for(const selectedComm of this.selectedCommunities){
      const concentricComm = document.getElementById(selectedComm);
      concentricComm.id = 'comm'+counter;
      console.log('renamed id'+concentricComm.id);
      counter++;
    }

    this.selectedCommunities = []; //empties this.selectedcommunities array
    console.log(this.selectedCommunities);



    //removes chips from the screen
    const chips = document.getElementsByClassName('chip');
    let chipsLength  =  chips.length;
    for (let i = 0; i < chipsLength; i++){
      chips[0].remove();
     }

    //remove startOver and Done buttons
    const startOverButton = document.getElementById('startOverButton');
    startOverButton.remove();
    const doneButton = document.getElementById('doneButton');
    doneButton.remove();

    //changes user instructions in header
    const header = document.querySelector('#create-community-screen h5');
    header.textContent = ("Choose your wider community. This is the broad area in which you'd like to connect with others");

    //remove suggested InnerCommunities
     const suggestions= document.getElementsByClassName('innerCommSuggestions');
     let suggestionsLength = suggestions.length;
     for(let i = 0; i < suggestionsLength; i++){
       suggestions[0].remove();
     }

    //display bigCommunities
    for (let i = 0; i < this.bigCommunities.length; i++) {
      this.bigCommunities[i].style.display = 'inline-block';
      //todo: check event listeners
    }

    //repleneish scale factor
    scaleFactor = 4;
}

//Saves user ingo to firebase real-time database
saveCommunity(event){
  console.log('enetered saveCommunity');
  event.preventDefault();
    firebase.database().ref('users/' + this.uid).set({
      username: this.name,
      email: this.email,
      profile_picture : this.photoUrl,
      communities: this.selectedCommunities
    });
    console.log('saved');
  //dispatch custom event to match screen
//  const myEvent = new CustomEvent('submitted', {detail: submitInfo});
  //document.dispatchEvent(myEvent);
  this.hide();
}



  hide(){
    this.containerElement.classList.add('inactive');
    //show match screen
    //const matchScreenElement  =  document.querySelector('#match-screen');
    //this.matchScreen = new matchScreen(matchScreenElement);
  //  matchScreenElement.classList.remove('inactive');
  }



  }
