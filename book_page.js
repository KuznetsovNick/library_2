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
    sendRequest("GET", "/list")
        .then(res => document.location.href='/list')
}

function confirm_redact(){
    let author = document.getElementsByClassName("author_redact").item(0).value
    let title = document.getElementsByClassName("title_redact").item(0).value
    let year = document.getElementsByClassName("year_redact").item(0).value

    let data = {
        id: selected_book,
        title: title,
        author: author,
        year: year
    }

    sendRequest("POST", "/redact_book", data)
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

function sort_date(){
    sendRequest("POST", "/list/sort_date")
        .then(res => res.json())
        .then(json => {
            page = 1
            books = JSON.parse(json)
            fill_table()
        })
}

function choose_book(div_num){
    close_redact_page()
    close_issue_page()
    let div_ind = div_num - 1
    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)
    let div_issue = document.getElementsByClassName("issue").item(0)
    let div_return = document.getElementsByClassName("return").item(0)
    div_issue.style.visibility = "hidden"
    div_return.style.visibility = "hidden"

    div_list.style.left = "calc(50% - 200px)"
    div_info.style.visibility = "visible"

    let title = document.getElementsByClassName("title").item(0)
    let author = document.getElementsByClassName("author").item(0)
    let year = document.getElementsByClassName("year").item(0)
    let owner = document.getElementsByClassName("owner").item(0)
    let date = document.getElementsByClassName("return_date").item(0)

    title.innerHTML = books[(page-1)*list_size + div_ind]["title"]
    author.innerHTML = books[(page-1)*list_size + div_ind]["author"]
    year.innerHTML = books[(page-1)*list_size + div_ind]["year"]

    if(books[(page-1)*list_size + div_ind]["owner"]){
        owner.innerHTML = books[(page-1)*list_size + div_ind]["owner"]
    } else{
        owner.innerHTML = "-"
    }

    if(books[(page-1)*list_size + div_ind]["returnDate"]){
        date.innerHTML = books[(page-1)*list_size + div_ind]["returnDate"]
    } else{
        date.innerHTML = "-"
    }

    selected_book = books[(page-1)*list_size + div_ind]["id"]

    if(!books[(page-1)*list_size + div_ind]["owner"]){
        div_issue.style.visibility = "visible"
    }
    else{
        div_return.style.visibility = "visible"
    }
}

function close_book_page(){
    close_redact_page()
    close_issue_page()
    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)

    let div_issue = document.getElementsByClassName("issue").item(0)
    let div_return = document.getElementsByClassName("return").item(0)
    div_issue.style.visibility = "hidden"
    div_return.style.visibility = "hidden"

    div_info.style.visibility = "hidden"

    div_list.style.left = "calc(50% - 100px)"

    let d = document.getElementById("dialog").open = false
}

function delete_book(){
    let result = confirm("Are you sure?");
    if(result){
        let data = {id: selected_book}
        sendRequest("POST", "/list/delete", data)
            .then(res => res.json())
            .then(json => {
                page = 1
                books = JSON.parse(json)
                close_book_page()
                fill_table()
            })
    }
}

function issue_page(){
    document.getElementsByClassName("redact").item(0).style.visibility = "hidden"

    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)
    let div_issue = document.getElementsByClassName("issue_page").item(0)


    div_list.style.left = "calc(50% - 300px)"
    div_info.style.left = "calc(50% - 100px)"
    div_issue.style.visibility = "visible"
}

function accept_issue(){
    let owner = document.getElementsByClassName("owner_input").item(0)
    let date = document.getElementsByClassName("date_input").item(0)
    if(owner.value && date.value){
        let data = {id: selected_book, owner: owner.value, date: date.value}
        sendRequest("POST", "/list/issue", data)
            .then(res => res.json())
            .then(json => {
                page = 1
                books = JSON.parse(json)
                close_book_page()
                fill_table()
            })
    }
}

function return_book(){
    let data = {id: selected_book}
    sendRequest("POST", "/list/return", data)
        .then(res => res.json())
        .then(json => {
            page = 1
            books = JSON.parse(json)
            close_book_page()
            fill_table()
        })
}

function close_issue_page(){
    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)
    let div_issue = document.getElementsByClassName("issue_page").item(0)

    div_issue.style.visibility = "hidden"
    div_list.style.left = "calc(50% - 200px)"
    div_info.style.left = "50%"
}

function dialog() {
    let d = document.getElementById("dialog")
    let owner = document.getElementsByClassName("owner").item(0).innerHTML
    if(d.open){
        d.open = false
    } else {
        if (owner != "-") {
            d.innerHTML = `Info about ${owner}`
        } else {
            d.innerHTML = "-"
        }
        d.open = true
    }
}

function open_redact(){
    document.getElementsByClassName("issue_page").item(0).style.visibility = "hidden"

    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)
    let div_redact = document.getElementsByClassName("redact").item(0)


    div_list.style.left = "calc(50% - 300px)"
    div_info.style.left = "calc(50% - 100px)"
    div_redact.style.visibility = "visible"
}

function close_redact_page(){
    let div_list = document.getElementsByClassName("parent").item(0)
    let div_info = document.getElementsByClassName("book_info").item(0)
    let div_redact = document.getElementsByClassName("redact").item(0)

    div_redact.style.visibility = "hidden"
    div_list.style.left = "calc(50% - 200px)"
    div_info.style.left = "50%"
}

function start_page(){
    sendRequest("GET", "/")
        .then(res => document.location.href='/')
}