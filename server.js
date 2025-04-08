const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { NFC } = require('nfc-pcsc');

dotenv.config();
console.log('Server is: ', process.env.MONGODB_URI);

const app = express();

// Middleware pentru CORS
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectare la MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  calorie: Number,
  category: String,
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  number: { type: Number, default: 0 },
  paid: { type: String, default: null },
  isReady: { type: Boolean, default: false },
  inProgress: { type: Boolean, default: true },
  isCanceled: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  itemsPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  orderItems: [{
    name: String,
    price: Number,
    quantity: Number,
  }],
}, { timestamps: true }));


const Counter = mongoose.model('Counter', new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
}));

async function initializeCounter() {
  try {
    await Counter.findByIdAndUpdate(
      'orderNumber',
      { $setOnInsert: { sequence_value: 0 } },
      { upsert: true, new: true }
    );
    console.log('Counter initialized');
  } catch (error) {
    console.error('Error initializing counter:', error);
  }
}

initializeCounter();

// Endpoint-uri API
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Product.find(category ? { category } : {});
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).send({ message: 'Error saving product' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({ isDelivered: false, isCanceled: false });
    res.json(orders);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching orders' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (req.body.action === 'ready') {
        order.isReady = true;
        order.inProgress = false;
      } else if (req.body.action === 'deliver') {
        order.isDelivered = true;
      } else if (req.body.action === 'cancel') {
        order.isCanceled = true;
      }
      await order.save();
      res.send({ message: 'Done' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating order' });
  }
});
app.post('/api/orders', async (req, res) => {
  console.log('Received order data:', req.body);
  try {
    // Increment the order number atomically
    const counter = await Counter.findByIdAndUpdate(
      'orderNumber',
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const orderNumber = counter.sequence_value;
    const requiredFields = ['orderItems', 'totalPrice', 'taxPrice'];
    const missingFields = requiredFields.filter(field => !req.body[field] || (Array.isArray(req.body[field]) && req.body[field].length === 0));

    if (missingFields.length > 0) {
      return res.status(400).send({ message: `Order data is incomplete. Missing fields: ${missingFields.join(', ')}` });
    }

    const order = await new Order({ 
      ...req.body, 
      number: orderNumber, 
      paid: req.body.paid || null
    }).save();

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ message: 'Error creating order' });
  }
});



// Servește frontend-ul React
app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

// Configurare NFC și WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const nfc = new NFC();


nfc.on('reader', reader => {
  console.log(`Reader detected: ${reader.name}`);

  reader.on('card', card => {
    
    io.emit('nfc-card', card.uid);
    console.log(`Card detected: ${card.uid}`);
  });

  reader.on('error', err => {
    console.error(`Reader error: ${err}`);
  });

  reader.on('end', () => {
    console.log(`Reader disconnected: ${reader.name}`);
  });
});

nfc.on('error', err => {
  console.error(`NFC error: ${err}`);
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});
