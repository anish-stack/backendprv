const { createRecord, getRecord, confirmOrder, cancelOrder } = require("../Controllar/OrderControllar")
// const { verifyBuyer } = require("../verification")

const OrderRouter = require("express").Router()

OrderRouter.post("/", createRecord)
OrderRouter.get("/", getRecord)
OrderRouter.post("/confirm",confirmOrder)
OrderRouter.post("/cancel",cancelOrder)


module.exports = OrderRouter