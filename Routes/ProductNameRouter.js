const { createName, getAllNames, updateName, deleteName } = require("../Controllar/productNameController")

const ProductNameRouter = require("express").Router()

ProductNameRouter.post("/createNames", createName)
ProductNameRouter.get("/getAllNames", getAllNames)
ProductNameRouter.put("/:id", updateName)
ProductNameRouter.delete("/delete/:id", deleteName)
// ProductNameRouter.post("/", createName)

module.exports = ProductNameRouter