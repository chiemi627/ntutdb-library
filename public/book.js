// client-side js
// run by the browser each time your view template referencing it is loaded

const books = [];

const booksList = document.getElementById("books");

fetch("/getBooks", {})
  .then(res => res.json())
  .then(response => {
    console.log(JSON.stringify(response));
    response.forEach(row => {
      appendNewBook(row);
    });
  });

const appendNewBook = record => {
  const newListItem = document.createElement("li");
  var str = record.title
  if(record.userid){
    str+="...貸し出し中（"+record.userid+")"
    newListItem.style.color='#CCCCCC'    
  }
  newListItem.innerText = str+"  ";
  if(!record.userid){
    const button = document.createElement("a")
    button.innerText="借りる"
    button.href="/lend?bookid="+record.bookid
    newListItem.appendChild(button);
  }
  booksList.appendChild(newListItem);
};
