const Order = require("../Model/OrderModel")
const Product = require("../Model/ProductModel");
const User = require("../Model/UserModel")
exports.createRecord = async (req, res) => {
    try {
        const { userid, cartItems } = req.body;
        if (!userid || !cartItems || !Array.isArray(cartItems)) {
            return res.status(400).json({
                success: false,
                message: "Invalid cart items format"
            });
        }

        const productsUpdated = [];

        for (const productData of cartItems) {
            try {
                const product = await Product.findById(productData.productId);
                if (!product) {
                    console.log(`Product with ID ${productData.productId} not found`);
                    continue;
                }

                const updatedStock = product.stock - productData.quantity;

                if (updatedStock < 0) {
                    return res.status(402).json({
                        success: false,
                        msg: `Insufficient stock for product ${product.name}. Available Stock is ${product.stock}`
                    });
                }

                product.stock = updatedStock;
                await product.save();
                productsUpdated.push({
                    productId: product._id,
                    name: product.name,
                    sizename: productData.sizename,
                    quantity: productData.quantity,
                    color: productData.color,
                    image: productData.image,
                    maincategory: productData.maincategory,
                    subcategory: productData.subcategory
                });

                console.log(`Product stock updated for ${product.name}. New stock: ${updatedStock}`);
            } catch (error) {
                console.log(error);
                // Handle error
            }
        }

        // Create a new order record
        const newOrder = new Order({ userid, product: productsUpdated });
        await newOrder.save();
        console.log(newOrder)
        res.status(200).json({
            success: true,
            message: "Record is created",
            data: newOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while processing the request"
        });
    }
}

exports.getRecord = async (req, res) => {
    try {
        let orders = await Order.find().populate('userid');
        console.log(orders)
        let combinedData = [];
        for (let order of orders) {
            let user = await User.findById(order.userid);

            if (user) {
                let combinedOrder = {
                    orderId: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    user: {
                        userId: user._id,
                        username: user.name,
                        phone: user.phone,
                        email: user.email
                    },
                    OrderStatus: order.OrderStatus, // Fix here
                    OrderDate: order.OrderDate // Fix here
                };
                combinedData.push(combinedOrder);
            }
        }
        res.status(200).json({
            success: true,
            data: combinedData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

exports.confirmOrder = async (req, res) => {
    try {
        const { orderid } = req.body;
        const order = await Order.findById(orderid);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.OrderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already Cancelled"
            });
        }
        if (order.OrderStatus === "Confirmed") {
            return res.status(400).json({
                success: false,
                message: "Order is already confirmed"
            });
        }

        console.log(order);
        const productsToUpdate = order.product;

        for (const productData of productsToUpdate) {
            try {
                const product = await Product.findById(productData.productId);
                console.log("I am Product", product);
                if (!product) {
                    console.log(`Product with ID ${productData._id} not found`);
                    continue;
                }

                const updatedStock = product.stock - productData.quantity;

                if (updatedStock < 0) {
                    return res.status(402).json({
                        success: false,
                        msg: `Insufficient stock for product ${product.name}. Available Stock is ${product.stock}`
                    });
                }

                product.stock = updatedStock;
                order.OrderStatus = "Confirmed"; // Update order status here
                await product.save();
                await order.save(); // Save the updated order status

                console.log(`Product stock updated for ${product.name}. New stock: ${updatedStock}`);
            } catch (error) {
                console.log(error);
                // Handle error
            }
        }

        res.status(200).json({
            success: true,
            message: "Order confirmed successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};
exports.cancelOrder = async (req, res) => {
    try {
        const { consOrder } = req.body;
        const order = await Order.findById(consOrder.orderid);
    
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.OrderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }
        if (order.OrderStatus === "Confirmed") {
            return res.status(400).json({
                success: false,
                message: "Order is already confirmed"
            });
        }
        const productsToUpdate = order.product;

        for (const productData of productsToUpdate) {
            try {
                const product = await Product.findById(productData.productId);
                if (!product) {
                    console.log(`Product with ID ${productData.productId} not found`);
                    continue;
                }

                // Restore the stock for the cancelled order
                const updatedStock = product.stock + productData.quantity;
                product.stock = updatedStock;
                await product.save();
                console.log(`Product stock updated for ${product.name}. New stock: ${updatedStock}`);
            } catch (error) {
                console.log(error);
                // Handle error
            }
        }

        // Update order status to "Cancelled"
        order.OrderStatus = "Cancelled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};
