require('dotenv').config({ path: './backend/config.env' });
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./backend/routes/authRoutes');
const productRoutes = require('./backend/routes/productRoutes');
const distributorRoutes = require('./backend/routes/distributorRoutes');
const categoryRoutes = require('./backend/routes/categoryRoutes');
const auditRoutes = require('./backend/routes/auditRoutes');
const ownCommerceRoutes = require('./backend/routes/ownCommerceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/own-commerce', ownCommerceRoutes);

app.get('/', (req, res) => {
  res.send('Inventory System API');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 