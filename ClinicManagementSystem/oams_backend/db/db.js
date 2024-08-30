require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb+srv://jamkarabhishek:Abhishek123@cluster0.dta3ws0.mongodb.net/OAMS?retryWrites=true&w=majority',
      process.env.MONGO_URI || 'mongodb+srv://techplementwebteam:#Abhishek123@cluster0.7u0wxyp.mongodb.net/OAMS?retryWrites=true&w=majority',

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
      },
    )

    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed')
    process.exit(1)
  }
}

module.exports = {connectDB}
