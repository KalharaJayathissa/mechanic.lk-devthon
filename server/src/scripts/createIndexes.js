const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Mechanic = require('../models/Mechanic');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        console.log('Creating indexes for Mechanic collection...');

        // Explicitly create the 2dsphere index on location.coordinates
        // We also index location itself just in case, though usually location.coordinates is enough for 2dsphere
        await Mechanic.collection.createIndex({ "location": "2dsphere" });
        await Mechanic.collection.createIndex({ "location.coordinates": "2dsphere" });

        console.log('Indexes created successfully');

        const indexes = await Mechanic.collection.indexes();
        console.log('Current Indexes:', indexes);

        process.exit();
    } catch (error) {
        console.error('Error creating indexes:', error);
        process.exit(1);
    }
};

createIndexes();
