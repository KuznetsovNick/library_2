const express = require("express");
const router = express.Router();
const pug = require("pug")
const path = require('path')
let Manager = require('./manager.js');
let manager = new Manager();


let books = require("./library.json")


router.get("/", (req, res, next) => {
    res.send(pug.compileFile("start.pug", null)())
    //res.sendFile(path.join(__dirname, "book.html"))
});
router.get("/list", (req, res, next)=>{
    res.send(pug.compileFile("book_list.pug", null)({book: "Non"}))
});
router.post("/list/update", (req, res) => {
    res.json(manager.send_library())
})
router.post("/list/sort_stock", (req, res) => {
    res.json(manager.sort_stock())
})
router.get("/add_book_page", (req, res) => {
    res.send(pug.compileFile("add_book.pug", null)())
})
router.post("/add_book_page", (req, res) => {
    manager.add_to_library(req.body)
    res.json(manager.send_library())
})
router.post("/list/delete", (req, res) => {
    manager.delete_from_library(req.body)
    res.json(manager.send_library())
})
router.get("*", (req, res)=>{
    res.status(404);
    res.end("Page not found");
});

module.exports = router;