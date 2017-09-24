class inboxScreen {

  constructor(containerElement) {
    //define constructor params
    this.containerElement = containerElement;
    this.displayInbox = this.displayInbox.bind(this);
    this.database = firebase.database();
    this.loadInboxConversation = this.loadInboxConversation.bind(this);
    document.addEventListener('displayInbox',this.displayInbox);

    }

    //MessagesRef =  messages
    //for each child of messages
      //prder in terms of timestamp
      //create div : inside div put :
        //<img id = "recipientPictureHeader" class= 'btn-floating' style="width:10%;height:10%;"</img>
        //<a id="recipientNameHeader" href="#"></a>

    displayInbox(event){
      console.log('displaying inbox');


          //foreach chatID object{
            //query for user's name and profile picture
            //createDiv to display Name and Object
            console.log(Math.floor(Date.now()));
      var currentUser = firebase.auth().currentUser;
      const currentUserInboxChatsRef = this.database.ref('/user-chats/'+ currentUser.uid);



      //query called each time the timestamp value is changed - todo: check this
      currentUserInboxChatsRef.orderByChild('timestamp').on("value",(snap)=>{
        console.log(snap.val());

        //todo: empty the inbox container before populating it again
        const container = document.getElementById('inbox');
        container.innerHTML ='';
        snap.forEach((data)=>{
          const recipientID = data.val().recipientID;
          console.log('recipient id: ' + data.val().recipientID);
          const chatID = data.val().chatID;
          this.loadInboxConversation(recipientID,chatID);
        });
      });
        }


        loadInboxConversation(recipientID,chatID){
          console.log('loading convo into inbox');
          const usersref = this.database.ref('/users');
          var currentUser = firebase.auth().currentUser;


          usersref.child(recipientID).orderByChild("email").once("value",(snapshot)=>{
            console.log('retrieving user info');
            const convoDiv = document.createElement('div');
            convoDiv.id = chatID; //so that when user clicks this div we can query for this conversation
            const profilePic = snapshot.val().profile_picture;
            const userName  = snapshot.val().username;

            const image = document.createElement('img');
            image.style.borderRadius = '100%';
            image.src = profilePic;
            convoDiv.appendChild(image);
            const nameSpan = document.createElement('span');
            nameSpan.textContent = userName;
            convoDiv.appendChild(nameSpan);
            convoDiv.classList.add('z-depth-5');
            convoDiv.style.background = '#e3f2fd';
            const container = document.getElementById('inbox');
            container.appendChild(convoDiv);
          });


        }

}
