function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
  console.log(response);                   // The current login status of the person.
  let logging_btn = document.getElementById('spinner');
  let status_div = document.getElementById('status');

  if (response.status === 'connected') {   // Logged into your webpage and Facebook.
    logging_btn.style.display = 'none';
    status_div.style.display = 'block';
    displayInfo();
  }
  else {                                 // Not logged into your webpage or we are unable to tell.
    logging_btn.style.display = 'block';
    status_div.style.display = 'none';
  }
}


function checkLoginState() {               // Called when a person is finished with the Login Button.
  FB.getLoginStatus(function (response) {   // See the onlogin handler
    statusChangeCallback(response);
  });
}


window.fbAsyncInit = function () {
  FB.init({
    appId: '528660749177805',
    cookie: true,                     // Enable cookies to allow the server to access the session.
    xfbml: true,                     // Parse social plugins on this webpage.
    version: 'v16.0'           // Use this Graph API version for this call.
  });


  FB.getLoginStatus(function (response) {   // Called after the JS SDK has been initialized.
    statusChangeCallback(response);        // Returns the login status.
  });
};

function displayInfo() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  let set = (id, value) => document.getElementById(id).innerHTML = value;

  FB.api('/me', user_info => {
    set('username', user_info.name);
    set('user_id', user_info.id);
    set('user_token', FB.getAccessToken());

    FB.api('/me/accounts', page_info => {
      let page_id = page_info.data[0].id
      set('page_name', page_info.data[0].name);
      set('page_id', page_id);
      set('page_token', page_info.data[0].access_token);

      FB.api(`/${page_id}`, page_acc => {
        let ig_id = page_acc.instagram_business_account.id;
        FB.api(`/${ig_id}`, ig_info => {
          set('ig_name', ig_info.name);
          set('ig_username', ig_info.username);
          set('ig_id', ig_id);
        }, { fields: 'name,username' })
      }, { fields: 'instagram_business_account' });
    });
  });
}
