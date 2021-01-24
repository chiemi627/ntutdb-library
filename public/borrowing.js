// client-side js
// run by the browser each time your view template referencing it is loaded

const books = [];

const booksList = document.getElementById("borrowing_books");
const userid = window.sessionStorage.getItem(["userid"]);
const message = document.getElementById("message");

fetch("/getBorrowingBooks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userid: userid })
})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewBook(row);
    });
  });

// a helper function that creates a list item for a given dream
const appendNewBook = record => {
  const newListItem = document.createElement("li");
  newListItem.setAttribute("id",record.bookid);
  var str = record.title;
  newListItem.innerText = str + "  ";
  if (!record.userid) {
    const button = document.createElement("a");    
    button.innerText = "返す";
    button.href="javascript:void(0);";
    button.setAttribute("onclick",`returnBook("${record.bookid}");`);
    newListItem.appendChild(button);
  }
  booksList.appendChild(newListItem);
};

function returnBook(bookid) {
  console.log(bookid);
  const data = {
    userid: userid,
    bookid: bookid
  };

  fetch("/returnBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      message.innerText = "返却ありがとうございました！";
      document.getElementById(bookid).remove();
    });
}
