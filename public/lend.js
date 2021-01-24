// client-side js
// run by the browser each time your view template referencing it is loaded

const bookid = document.getElementById("bookid");
const message = document.getElementById("message");

function lendBook() {
  const userid = window.sessionStorage.getItem(['userid']);
  const data = {
    userid: userid,
    bookid: bookid.innerHTML
  };
  fetch("/lendBook",{
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-Type": "application/json"}    
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
      message.innerHTML = response.message;
      const link = document.createElement("a");
      link.innerText = "蔵書リスト";
      link.href = "/books";
      message.appendChild(document.createElement("br"));
      message.appendChild(link);
      if(response.status == "SUCCESS"){
        document.getElementById("book_borrow").remove();
      }
  })
}
  
