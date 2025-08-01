const mongoose = require('mongoose');

async function connectDb(){
    try{
        await mongoose.connect('mongodb://localhost:27017/coffe_shop',{
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });
        console.log('MongoDb connected');
    }catch(err){
        console.error('MongoDb connection error:', err.message);
        process.exit(1);;
    }
}

module.exports = connectDb;