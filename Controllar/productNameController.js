const ProductNames = require('../Model/ProductName')

exports.createName = async (req, res) => {
    try {
        console.log("i am hit")
        const { ProductName, subcategory, maincategory } = req.body;
        console.log(req.body)
        if (!ProductName || !subcategory || !maincategory) {
            return res.status(403).json({
                success: false,
                msg: "Fill All Fields"
            });
        }
        console.log(req.body)

        // Save in database
        const newName = new ProductNames({ ProductName, subcategory, maincategory });
        await newName.save();

        res.status(201).json({
            success: true,
            msg: "Successfully created"
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

exports.updateName = async (req, res) => {
    try {
        const { id } = req.params;
        const { ProductName, subcategory, maincategory } = req.body;

        if (!ProductName || !subcategory || !maincategory) {
            return res.status(400).json({
                success: false,
                msg: "Fill all fields"
            });
        }

        const updatedName = await ProductNames.findByIdAndUpdate(id, { ProductName, subcategory, maincategory }, { new: true });

        if (!updatedName) {
            return res.status(404).json({
                success: false,
                msg: "Product name not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Product name updated successfully",
            data: updatedName
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

exports.deleteName = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedName = await ProductNames.findByIdAndDelete(id);

        if (!deletedName) {
            return res.status(404).json({
                success: false,
                msg: "Product name not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Product name deleted successfully",
            data: deletedName
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

exports.getAllNames = async (req, res) => {
    try {
        const names = await ProductNames.find();

        res.status(200).json({
            success: true,
            data: names
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};
