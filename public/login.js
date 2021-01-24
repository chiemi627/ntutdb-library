function login() {
  const loginForm = document.forms[0];
  const userid = loginForm.elements["userid"];
  const data = {
    userid: userid.value
  };
  fetch("/login",{
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-Type": "application/json"}    
  })
    .then(res => res.json())
    .then(response => {
      const message = document.getElementById("message");
      console.log(JSON.stringify(response));
      message.innerHTML = response.message;
      if(response.status == "SUCCESS"){
        window.sessionStorage.setItem(['userid'],[response.userid]);
        window.open("/books","_self");
      }
  });
}