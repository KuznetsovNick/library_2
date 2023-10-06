let page = 1
let books
let list_size = 10
let selected_book

function fill_table(){
    let divs = document.getElementsByClassName("parent").item(0).childNodes

    for(let i = 0; i < list_size; i++){
        divs.item(i).style.visibility = "visible";
    }

    let len = list_size
    if(books.length - (page-1)*list_size < list_size){
        len = books.length - (page-1)*list_size
    }
    for(let i = 0; i < len; i++){
        divs.item(i).innerHTML = `${(page-1)*list_size+i+1}. ${books[(page-1)*list_size+i]["title"]}`
    }

    for(let i = len; i < list_size; i++){
        divs.item(i).display = false
        divs.item(i).style.visibility = "hidden";
    }
}

function sendRequest(type, URL, data=null) {
    if(data){
        data = JSON.stringify(data)
    }
    return fetch(
        URL,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            method: type,
            body: data,
        })
}

function update_table(){
    sendRequest("POST", "/list/update")
        .then(res => res.json())
        .then(json => {
            page = 1
            books = JSON.parse(json)
            fill_table()
        })
}

function add_book_page(){
    sendRequest("GET", "/add_book_page")
        .then(res => {
            document.location.href='/add_book_page';
        })
}

function confirm_adding(){
    let author = document.getElementsByClassName("author").item(0).value
    let title = document.getElementsByClassName("book").item(0).value
    let year = document.getElementsByClassName("year").item(0).value
    let data = {
        title: title,
        author: author,
        year: year
    }
    if(author && title && year){
        sendRequest("POST", "/add_book_page", data)
            .then(res => document.location.href='/list')
    }
}

function cancel_adding(){
    sendRequest("GET", "/list/")
        .then(res => document.location.href='/list')
}

function next_page(){
    if(Math.floor(books.length/(page*list_size)) > 0){
        page++
        fill_table()
    }
}

function prev_page(){
    if(page > 1){
        page--
        fill_table()
    }
}

function sort_stock(){
    sendRequest("POST", "/list/sort_stock")
        .then(res => res.json())
        .then(json => {
            page = 1
            books = JSON.parse(json)
            fill_table()
        })
}

function choose_book(div_num){
    let div_ind = div_num - 1
    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)
    div_list.style.left = "calc(50% - 200px)"
    div_info.style.visibility = "visible"

    let title = document.getElementsByClassName("title").item(0)
    let author = document.getElementsByClassName("author").item(0)
    let year = document.getElementsByClassName("year").item(0)

    title.innerHTML = books[(page-1)*list_size + div_ind]["title"]
    author.innerHTML = books[(page-1)*list_size + div_ind]["author"]
    year.innerHTML = books[(page-1)*list_size + div_ind]["year"]
    selected_book = books[(page-1)*list_size + div_ind]["id"]
}

function close_book_page(){
    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)

    div_list.style.left = "calc(50% - 100px)"
    div_info.style.visibility = "hidden"
}

function delete_book(){
    let result = confirm("Are you sure?");
    if(result){
        let data = {id: selected_book}
        sendRequest("POST", "/list/delete", data)
            .then(res => {
                document.location.href = '/list'
                update_table()
            })
    }
}