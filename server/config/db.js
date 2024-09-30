const mongoose = require('mongoose');

const connect = async () => {
    try {
        // Connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected');
        console.log(`Mongo URI: ${process.env.MONGO_URI}`); // Logging the connection URI
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connect;
