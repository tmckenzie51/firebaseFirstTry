//add the on authStateChanged method here /  check if user already exists
  //if(user){
    //load previous communities}
  //else{ display registration page & send verification/welcome email}


//Todo Later : load user's previous communities (perhaps use onAuthStateChanged here)
//}



var database = firebase.database(); //database reference

let scaleFactor = 4;
let currentY = null; //currentY stays constant throughout the entire screen

  class createCommunity {

    constructor(containerElement) {
      //define cosntructor params
      this.containerElement = containerElement;

      // todo: organize properly here
      this.openModalView = this.openModalView.bind(this);
      this.createCustomCommunity = this.createCustomCommunity.bind(this);
      const submittedCustomCommunity =  document.querySelector('#labeledCustomCommunity');
      submittedCustomCommunity.addEventListener('click',this.createCustomCommunity);
      this.displayConcentricCommunities = this.displayConcentricCommunities.bind(this);

      //array declarations
      //this.user = firebase.auth().currentUser; //todo: maybe get rid of this
      this.selectedCommunities = [];
      this.wellnessSuggestions = ['Mental', 'Insurance', 'Fitness','Mental', 'Insurance', 'Fitness',];
      this.academicsSuggestions = ['Science', 'Humanities', 'Arts','Science', 'Humanities', 'Arts'];
      this.RelationshipSuggestions = ['Romantic', 'Break-up', 'Family','Romantic', 'Break-up', 'Family'];
      this.hobbiesSuggestions = ['Cycling','Basketball','Poetry','Cycling','Basketball','Poetry'];
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

      const header = document.querySelector('#create-community-screen h4');
      const text = 'Welcome '+this.name+'!'; //todo: make this work or take it out
      header.textContent=text;

      //todo: organize this
      this.navigateToStoryboard = this.navigateToStoryboard.bind(this);
      const storyboardButtons = document.getElementsByClassName('storyboardButton');
      for(const button of storyboardButtons){
        button.addEventListener('click',this.navigateToStoryboard);
      }

      //todo: organize this
      this.navigateToMatchScreen = this.navigateToMatchScreen.bind(this);
      const matchButtons = document.getElementsByClassName('matchesButton');
      for(const button of matchButtons){
        button.addEventListener('click',this.navigateToMatchScreen);
      }

      //todo: organize this
      this.navigateToInbox = this.navigateToInbox.bind(this);
      const inboxButtons =  document.getElementsByClassName('messagesButton');
      for(const button of inboxButtons){
        button.addEventListener('click',this.navigateToInbox);
      }

      //todo: organize this
      this.signOut = this.signOut.bind(this);
      const signOutButtons =  document.getElementsByClassName('signOutButton');
      for(const button of signOutButtons){
        button.addEventListener('click',this.signOut);
      }

      }

      navigateToMatchScreen(event){
        console.log('navigating to match screen');
        this.containerElement.classList.add('inactive');
        const matchScreenElement = document.getElementById('match-screen');
        const myEvent = new CustomEvent('submitted');
        matchScreenElement.classList.remove('inactive');
        document.dispatchEvent(myEvent);
      }

      navigateToInbox(event){
        console.log('redirecting to inbox');
        this.containerElement.classList.add('inactive');
        const inboxScreen = document.getElementById('inboxScreen');
        const myEvent = new CustomEvent('displayInbox'); //add event details here if needed
        inboxScreen.classList.remove('inactive');
        document.dispatchEvent(myEvent);
      }

      navigateToStoryboard(event){
        //todo: nav to storyboard
        console.log('redirecting to storyboard');
      }

//todo: add a modal view here, 'are you sure you want to sign out ? ""'
signOut(event){
  firebase.auth().signOut().then(function() {
// Sign-out successful.
}).catch(function(error) {
// An error happened.
});
const loginElement = document.querySelector('#loginScreen');
document.getElementById('header').classList.add('inactive');
this.containerElement.classList.add('inactive');
loginElement.classList.remove('inactive');
}

openModalView(event){
  $('.modal').modal();
  $('#modal1').modal('open');
  $('input#Custom-Community').characterCounter(); //todo: fix the characterCounter

  //or by click on trigger using  $('.trigger-modal').modal();

 //autocomplete code
   $('input.autocomplete').autocomplete({
   data: {
     "Apple": null,
     "Microsoft": null,
     "Google": 'https://placehold.it/250x250'
   },
   limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
   onAutocomplete: function(val) {
     // Callback function when value is autcompleted.
   },
   minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
 });

}

createCustomCommunity(event){

   //get value from input
   let input = document.getElementById("Custom-Community").value;
   console.log('custom community: '+input);
   this.displayConcentricCommunities(input);
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
        this.bigCommunities[i].style.display = 'none';
        if(this.bigCommunities[i].textContent.trim() === firstCommunity.trim()){
          this.displaySuggestions(this.suggestions[i]); //to display the correct suggestions
      }
    }
      //change user instructions in header
      const header = document.querySelector('#create-community-screen h5');
      header.textContent = ('Choose and create your own inner communities and click "Done" when your Community is just right for you!');



    }

  //displays suggested inner communities
  displaySuggestions(suggestions){
    const suggestionId = document.querySelector('#bigCommInnerContainer');

    //creates the 'Create Custom Community' button which triggers the createCustomCommunity function on click
    const suggestionDiv = document.createElement('div');
    suggestionDiv.id = 'suggestionDiv';
    suggestionDiv.classList.add('innerCommSuggestions');
    const icon = document.createElement('i');
    icon.classList.add("material-icons", 'large');
    icon.textContent = 'add_circle_outline';
    suggestionDiv.appendChild(icon);
    suggestionDiv.style.display = 'inline-block';
    suggestionDiv.style.background = '#e0f2f1';
    const modalTrigger = document.querySelector('#createCustomCommunity');
    modalTrigger.appendChild(suggestionDiv)
    modalTrigger.addEventListener('click', this.openModalView);
    suggestionId.appendChild(modalTrigger);

    //creates other suggestions from suggestions array
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

    //displays concentric communities
    this.displayConcentricCommunities(community);

  }

  displayConcentricCommunities(community){
    this.selectedCommunities.push(community);



    //inner community styling
    const innercomm = document.querySelector('#comm'+this.selectedCommunities.length)
    innercomm.textContent = community;
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

    innercomm.id = community;
    innercomm.classList.remove('inactive');
    scaleFactor --;
    console.log(this.selectedCommunities);
  }

  removeCommunity(event){

    //remove the community with the corresponding name

    //remove bad concentric community
    const badCommText = event.currentTarget.textContent; //returns commName+'close'
    var  badCommName= badCommText.replace(/close/i,'');
    const badComm = document.getElementById(badCommName);
    badComm.classList.add('inactive');
    badComm.id = 'comm'+this.selectedCommunities.length; //todo: fix bug where there may now be 2 innercoms with the same name
    console.log(badComm.id);
    scaleFactor++; //todo: fix bug where there are more than one innercoms with the same scaleFactor
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
    doneDiv.addEventListener('click',this.saveCommunity);
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
    }

    //repleneish scale factor
    scaleFactor = 4;
}

//Saves user info to firebase real-time database
saveCommunity(event){

//creating the comunityData to writ einto the database
if(this.selectedCommunities.length === 4){
  var communityData = {
    bigCommunity: this.selectedCommunities[0],
    innerComm1: this.selectedCommunities[1],
    innerComm2: this.selectedCommunities[2],
    innerComm3: this.selectedCommunities[3]
  }
}else if(this.selectedCommunities.length === 3){
  var communityData = {
  bigCommunity: this.selectedCommunities[0],
  innerComm1: this.selectedCommunities[1],
  innerComm2: this.selectedCommunities[2]
}
}else if(this.selectedCommunities.length === 2){
  var communityData = {
  bigCommunity: this.selectedCommunities[0],
  innerComm1: this.selectedCommunities[1]
}
}


const user =  firebase.auth().currentUser;


// var communityRef = firebase.database().ref("user-communities/"+ user.uid + "/");
// var newCommunityRef = communityRef.push()
// newCommunityRef.set({
//   communityData
// });
// this.hide();

  // Get a key for a newly created community.
// var newCommunityKey = firebase.database().ref().child("user-communities/"+ user.uid + "/").push().key; //todo: should child be 'comunities' or should it be 'UserID' or user-communities
//



  // Write the newCommunity's data to user's communities list.
  var updates = {};
  updates['/user-communities/communityOne/' + user.uid] = communityData;

  this.hide();
  return firebase.database().ref().update(updates);



}
  hide(){
    console.log('showing match screen');
    this.containerElement.classList.add('inactive');
    //dispatch custom event to matchScreen in order to query the database
    event.preventDefault();

    const myEvent = new CustomEvent('submitted');
    document.dispatchEvent(myEvent);
    //show match screen
    const matchScreenElement  =  document.querySelector('#match-screen');
    matchScreenElement.classList.remove('inactive');

  }

  }
