const { createRecord, getRecord, deleteRecord } = require("../Controllar/ContactControllar")
const { verifyAdmin } = require("../verification")
// const { verifyBuyer } = require("../verification")

const ContactRouter = require("express").Router()


ContactRouter.post("/", createRecord)
ContactRouter.get("/",verifyAdmin , getRecord)
ContactRouter.delete("/:_id",verifyAdmin , deleteRecord)

module.exports = ContactRouter