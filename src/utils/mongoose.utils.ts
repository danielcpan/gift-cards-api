import mongoose from 'mongoose';
import config from '../config';

export const connectMongo = () => {
  try {
    mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    // mongoose.set('useFindAndModify', false);

    console.log('Mongo Connection Successful');
  } catch (err) {
    console.log(`Mongo Connection Error: ${err}`);
  }
};

export const disconnectMongo = () => {
  mongoose.connection.close();
};

export const clearDatabase = async () => {
  if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
};
