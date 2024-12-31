import express from 'express';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';


const port = 4000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/firm_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const DataSchema = new mongoose.Schema({
  company_name: String,
  status_label:String,
  year: Number,
  X1: Number,
  X2: Number, 
  X3: Number,
  X4: Number,
  X5:Number, 
  X6:Number, 
  X7:Number, 
  X8:Number, 
  X9:Number, 
  X10:Number, 
  X11:Number, 
  X12:Number, 
  X13:Number, 
  X14:Number, 
  X15:Number, 
  X16:Number, 
  X17:Number, 
  X18:Number, 
});

const userSchema = new mongoose.Schema({
  fname:String,
  lname:String,
  email: String,
  password: String,
});




const sch =  mongoose.model('company_statuses', DataSchema);
const User = mongoose.model('login_users', userSchema);


let users = {
  uname: 'example@example.com', // Example username
  
};



app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/predict_firm', req.body);
    const prediction = response.data.prediction;
    console.log(prediction);
    res.json({ prediction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error making prediction' });
  }
});


app.post('/api/predicttensor', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/predict_profit', req.body);
    const prediction = response.data.prediction;
    console.log(prediction);
    res.json({ prediction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error making prediction' });
  }
});

app.get('/items', async (req, res) => {
  try {
    //prompt for getting username from user

    const users = await sch.find();
    //print users on cmd
    console.log(users);
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
);

app.post('/register', async (req, res) => {
  try {
    const { fname,lname,email, password } = req.body;
    if (!email || !password || !fname || !lname) {
      return res.status(400).send({ error: 'Enter Valid Data / Data is Missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email Already Exists' });
    }

    const user = new User({ fname,lname,email, password });
    await user.save();
    res.send({ message: 'User created successfully with name '+fname + " " + lname +" and username "+email });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and Password are Required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: 'Invalid Email or Password' });
    }

    if (user.password !== password) {
      return res.status(401).send({ error: 'Invalid Email or Password' });
    }

    res.status(200).send({ message: 'Log in successful'});
    users.uname = email;
    
    const existingUser = await User.findOne({ email });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/getusername', async (req, res) => {
  try {
    //prompt for getting username from user

      const data = await User.findOne({email:users.uname});
    //print users on cmd
    console.log(data);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/logout', (req, res) => {
  users = {}; // Clear user data on logout
  res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});