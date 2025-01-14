// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/artemis_blocks");

// Block Schema
const blockSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    type: {
        type: String,
        enum: ["single", "groupped"],
        required: true,
    },
    icon: String,
    selected: {
        type: Boolean,
        default: false,
    },
});

const Block = mongoose.model("Block", blockSchema);

// Selection Schema to store block selections
const selectionSchema = new mongoose.Schema({
    blockIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Block",
        },
    ],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Selection = mongoose.model("Selection", selectionSchema);

// Seed initial blocks if none exist
const seedBlocks = async () => {
    const count = await Block.countDocuments();
    if (count === 0) {
        const initialBlocks = [
            {
                title: "Block 1",
                description: "FM Companies",
                type: "groupped",
                icon: "/icons/ico-org.png",
            },
            {
                title: "Academy",
                type: "groupped",
                icon: "/icons/ico-academy.png",
            },
            {
                title: "Event Companies",
                description: "Description 3",
                icon: "/icons/ico-event.png",
                type: "groupped",
            },
            {
                title: "Local Clubs",
                description: "Description 3",
                icon: "/icons/ico-local-club.png",
                type: "single",
            },
            {
                title: "Community Groups",
                description: "Description 3",
                icon: "/icons/ico-org.png",
                type: "single",
            },
        ];
        await Block.insertMany(initialBlocks);
    }
};

seedBlocks();

// Get all blocks
app.get("/api/blocks", async (req, res) => {
    try {
        const blocks = await Block.find();
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blocks" });
    }
});

// Validation middleware
const validateBlockSelection = async (req, res, next) => {
    try {
        const { blockIds } = req.body;

        if (!blockIds || !Array.isArray(blockIds)) {
            return res.status(400).json({ error: "Invalid selection data. Block IDs must be an array." });
        }

        // Fetch blocks from the database to verify validity
        const validBlocks = await Block.find({ _id: { $in: blockIds } });

        // Verify all block IDs exist
        if (validBlocks.length !== blockIds.length) {
            return res.status(400).json({ error: "One or more block IDs are invalid or do not exist." });
        }

        // Proceed to the next middleware/handler
        next();
    } catch (error) {
        res.status(500).json({ error: "Validation failed. Please try again." });
    }
};

// Save block selection
app.post("/api/selections", validateBlockSelection, async (req, res) => {
    try {
        const { blockIds } = req.body;

        // Remove any existing selections
        await Selection.deleteMany({});

        // Create a new selection entry
        const selection = new Selection({ blockIds });
        await selection.save();

        res.status(201).json({
            message: "Selection saved successfully",
            selection: await selection.populate("blockIds"), // Populate block details for the response
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to save selection. Please try again." });
    }
});

// Get the latest selection
app.get("/api/selections/latest", async (req, res) => {
    try {
        const latestSelection = await Selection.findOne()
            .sort({ timestamp: -1 }) // Sort by most recent
            .populate("blockIds"); // Populate block data
        if (!latestSelection) {
            return res.json({ blockIds: [] }); // No selection exists
        }
        res.json({ blockIds: latestSelection.blockIds.map((block) => block._id) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch latest selection" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
