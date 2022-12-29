class UsersDataHandler {
  NUMBER_OF_USERS = 5;
  API_URL = `https://randomuser.me/api?results=${this.NUMBER_OF_USERS}`;
  constructor() {
  this.fetchUsers = this.fetchUsers.bind(this);
}
async fetchUsers() {
  try {
    const response = await fetch(this.API_URL); const { results } = await response.json(); 
    return results;
  }
  catch (err) {
    throw new Error('Fetch users data error!');
  }
}
}
class UsersViewHandler {
  listUsersContainer = document.querySelector('.list-users-container');
  fetchStatusContainer = document.querySelector('.download-result-status'); 
  fetchStatusText = document.querySelector('.download-result-status-text'); 
  SUCCESS_MESSAGE = 'Success!';
  FAIL_MESSAGE = 'Failed to load users!'; 
  USER_DATA_CONTAINER_INNER_HTML_TEMPLATE = `
  <div class="user-data-img-container">
  <img src="{{USER_PICTURE}}" alt="user" />
  </div>
  <div class="user-text-info">
  <ul>
  <li>Name: {{USER_NAME}}</li> <li>Cell: {{USER_CELL}}</li> <li>City: {{USER_CITY}}</li> <li>Country: {{USER_COUNTRY}}</li>
  </ul> </div>`;
  constructor(usersDataHandler, fetchUsersButton) { 
    this.usersDataHandler = usersDataHandler;
    this.fetchUsersButton = fetchUsersButton; 
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.fetchUsersButton.addEventListener('click', this.handleBtnClick);
  }
  renderUsers(usersData) {
    for (const user of usersData) {
    const userDataElement = document.createElement('div'); 
    const userDataInnerHTML = this.fillInUserDataTemplate(user); 
    userDataElement.innerHTML = userDataInnerHTML; 
    userDataElement.classList.add('user-data'); 
    this.listUsersContainer.appendChild(userDataElement);
  }
}
fillInUserDataTemplate(user) {
  return this.USER_DATA_CONTAINER_INNER_HTML_TEMPLATE.replaceAll(
    '{{USER_PICTURE}}',
    user.picture.large )
    .replaceAll('{{USER_NAME}}', `${user.name.first} ${user.name.last}`) 
    .replaceAll('{{USER_CELL}}', user.cell) 
    .replaceAll('{{USER_CITY}}', user.location.city) 
    .replaceAll('{{USER_COUNTRY}}', user.location.country);
  }
  clearUsersContainer() { this.listUsersContainer.innerHTML = ''; 
  this.fetchStatusContainer.style.visibility = 'hidden';
}
renderFailMessage() {
  this.fetchStatusContainer.style.visibility = 'visible'; 
  this.fetchStatusText.style.color = 'red'; 
  this.fetchStatusText.innerText = this.FAIL_MESSAGE;
}
renderSuccessMessage() { 
  this.fetchStatusContainer.style.visibility = 'visible'; 
  this.fetchStatusText.style.color = 'black'; this.fetchStatusText.innerText = this.SUCCESS_MESSAGE;
}
async handleBtnClick() { this.clearUsersContainer();
  const usersData = await this.usersDataHandler.fetchUsers().catch(() => { this.renderFailMessage();
    return null;
  });
  if (!usersData) return;
  this.renderSuccessMessage();
  this.renderUsers(usersData); }
}
const fetchUsersButton = document.querySelector('.download-users-button'); 
new UsersViewHandler(new UsersDataHandler(), fetchUsersButton);