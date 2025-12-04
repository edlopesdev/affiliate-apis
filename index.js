require('dotenv').config();
const express = require('express');
const axios = require('axios');
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

// ClickBank API - Real Integration
app.get('/clickbank/random-product', async (req, res) => {
  try {
    const response = await axios.get('https://api.clickbank.com/rest/1.3/products', {
      headers: {
        'Authorization': `Bearer ${process.env.CLICKBANK_API_KEY}`
      }
    });
    
    const products = response.data.data;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    res.json({
      success: true,
      product: randomProduct,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Amazon Products - Mock data (sem token)
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

// Video Generate API - OpenAI Integration
app.post('/video-generate', async (req, res) => {
  try {
    const { product, template } = req.body;
    
    // Use OpenAI to generate video script
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a video script writer for product marketing.'
        },
        {
          role: 'user',
          content: `Create a 30-second video script for this product: ${JSON.stringify(product)}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({
      success: true,
      message: "Video script generated",
      script: openaiResponse.data.choices[0].message.content,
      video_id: "vid_" + Date.now(),
      status: 'ready',
      estimated_time: '0s'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Notify API - Telegram Integration
app.post('/notify', async (req, res) => {
  try {
    const { message, data } = req.body;
    
    const telegramMessage = `🔔 *Notificação*\n\n${message}\n\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``;
    
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown'
      }
    );
    
    res.json({
      success: true,
      message: 'Notificação enviada com sucesso via Telegram'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Social Media Integration - Twitter
app.post('/social/twitter/post', async (req, res) => {
  try {
    const { text, product } = req.body;
    
    // Simulated Twitter post (requires OAuth 1.0a)
    res.json({
      success: true,
      message: 'Twitter post simulado (requer configuração OAuth)',
      post: {
        text: text || `Confira este produto: ${product.title}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Social Media Integration - Pinterest
app.post('/social/pinterest/pin', async (req, res) => {
  try {
    const { image_url, description, link } = req.body;
    
    // Simulated Pinterest pin
    res.json({
      success: true,
      message: 'Pinterest pin simulado',
      pin: {
        image_url,
        description,
        link,
        board_id: process.env.PINTEREST_BOARD_ID,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Social Media Integration - TikTok
app.post('/social/tiktok/post', async (req, res) => {
  try {
    const { video_url, caption } = req.body;
    
    // Simulated TikTok post
    res.json({
      success: true,
      message: 'TikTok post simulado',
      post: {
        video_url,
        caption,
        timestamp: new Date().toISOString()
      }
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
  console.log(`   - POST /social/twitter/post`);
  console.log(`   - POST /social/pinterest/pin`);
  console.log(`   - POST /social/tiktok/post`);
});
