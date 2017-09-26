class storyboardScreen {

  constructor(containerElement) {
    this.containerElement = containerElement;

    this.navigate = this.navigate.bind(this);
    const createCommunityButtons = document.getElementsByClassName('createCommunityButton');
    for(const button of createCommunityButtons){
      button.addEventListener('click',this.navigate);
    }

    const signOutButtons =  document.getElementsByClassName('signOutButton');
    for(const button of signOutButtons){
      button.addEventListener('click',this.navigate);
    }
    const inboxButtons =  document.getElementsByClassName('messagesButton');
    for(const button of inboxButtons){
      button.addEventListener('click',this.navigate);
    }
    
    const matchButtons = document.getElementsByClassName('matchesButton');
    for(const button of matchButtons){
      button.addEventListener('click',this.navigate);
    }

  }

  navigate(event){
    console.log('navigating to community screen');
    this.containerElement.classList.add('inactive');
  }
}
