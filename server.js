const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const NFC = require('nfc-pcsc').NFC;

dotenv.config();
console.log('server is: ', process.env.MONGODB_URI);

const app = express();

// Middleware pentru CORS
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectare la MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model(
  'Product',
  new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    price: Number,
    calorie: Number,
    category: String,
  })
);

const Order = mongoose.model(
  'Order',
  new mongoose.Schema(
    {
      number: { type: Number, default: 0 },
      orderType: String,
      paymentType: String,
      isPaid: { type: Boolean, default: false },
      isReady: { type: Boolean, default: false },
      inProgress: { type: Boolean, default: true },
      isCanceled: { type: Boolean, default: false },
      isDelivered: { type: Boolean, default: false },
      itemsPrice: Number,
      taxPrice: Number,
      totalPrice: Number,
      orderItems: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

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
  try {
    const lastOrder = await Order.find().sort({ number: -1 }).limit(1);
    const lastNumber = lastOrder.length === 0 ? 0 : lastOrder[0].number;
    if (
      !req.body.orderType ||
      !req.body.paymentType ||
      !req.body.orderItems ||
      req.body.orderItems.length === 0
    ) {
      return res.status(400).send({ message: 'Data is required.' });
    }
    const order = await new Order({ ...req.body, number: lastNumber + 1 }).save();
    res.json(order);
  } catch (error) {
    res.status(500).send({ message: 'Error creating order' });
  }
});


app.get('/api/latest-nfc-data', (req, res) => {
  res.json({ latestNfcData });
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
let latestNfcData = null;

nfc.on('reader', reader => {
  console.log(`Reader detected: ${reader.name}`);

  reader.on('card', card => {
    latestNfcData = card.uid;
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
  console.log(`Serverul HTTP rulează pe http://localhost:${port}`);
});
