const express = require("express");

const router  = express.Router();
const verifyRoutes = require("../middlewares/verifyRoutes")
const {createNotes , updateNotes , deleteNotes , getAllNotes , viewnote} = require("../controllers/notes");


router.post('/createnote' ,verifyRoutes, createNotes)
router.post('/updatenote/:id' ,verifyRoutes, updateNotes)
router.delete('/deletenote/:id',verifyRoutes,  deleteNotes)
router.get('/getallnotes' ,verifyRoutes,    getAllNotes)
router.get('/viewpost/:id' ,verifyRoutes, viewnote)


module.exports = router;


