const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'affiliate-apis',
    timestamp: new Date().toISOString()
  });
});

// Amazon API endpoints
const amazonProducts = [
  {
    id: 1,
    title: "Smart Watch Fitness Tracker",
    price: "$49.99",
    affiliate_link: "https://amzn.to/xxxxx",
    image: "https://example.com/smartwatch.jpg",
    commission: "8%"
  },
  {
    id: 2,
    title: "Wireless Bluetooth Earbuds",
    price: "$34.99",
    affiliate_link: "https://amzn.to/yyyyy",
    image: "https://example.com/earbuds.jpg",
    commission: "10%"
  },
  {
    id: 3,
    title: "Portable Phone Charger",
    price: "$24.99",
    affiliate_link: "https://amzn.to/zzzzz",
    image: "https://example.com/charger.jpg",
    commission: "12%"
  }
];

app.get('/amazon/random-product', (req, res) => {
  const randomProduct = amazonProducts[Math.floor(Math.random() * amazonProducts.length)];
  res.json({
    success: true,
    product: randomProduct,
    timestamp: new Date().toISOString()
  });
});

app.get('/amazon/products', (req, res) => {
  res.json({
    success: true,
    products: amazonProducts,
    count: amazonProducts.length
  });
});

// ClickBank API endpoints
const clickbankProducts = [
  {
    id: 1,
    title: "Digital Marketing Course",
    price: "$97.00",
    affiliate_link: "https://clickbank.com/xxxxx",
    commission: "50%"
  },
  {
    id: 2,
    title: "Weight Loss Program",
    price: "$47.00",
    affiliate_link: "https://clickbank.com/yyyyy",
    commission: "75%"
  }
];

app.get('/clickbank/random-product', (req, res) => {
  const randomProduct = clickbankProducts[Math.floor(Math.random() * clickbankProducts.length)];
  res.json({
    success: true,
    product: randomProduct,
    timestamp: new Date().toISOString()
  });
});

// Video Generate API
app.post('/video-generate', async (req, res) => {
  try {
    const { product, template } = req.body;
    res.json({
      success: true,
      message: "Video generation simulated",
      video_id: "sim_" + Date.now(),
      status: 'processing',
      estimated_time: '60s'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Notify API
app.post('/notify', async (req, res) => {
  try {
    const { type, message, data } = req.body;
    console.log(`Notification [${type}]: ${message}`, data);
    res.json({
      success: true,
      message: 'Notificação enviada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Affiliate APIs rodando na porta ${PORT}`);
  console.log(`📍 Endpoints disponíveis:`);
  console.log(`   - GET  /health`);
  console.log(`   - GET  /amazon/random-product`);
  console.log(`   - GET  /amazon/products`);
  console.log(`   - GET  /clickbank/random-product`);
  console.log(`   - POST /video-generate`);
  console.log(`   - POST /notify`);
});
