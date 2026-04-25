// One-off seeding script. Hits the running backend at http://localhost:8000.
// Creates a demo account and populates it with sellers, categories, brands,
// products, sales, and purchases.

const API = 'http://localhost:8000/api/v1';

const DEMO = {
  name: 'Demo User',
  email: 'demo@example.com',
  password: 'Demo1234!',
  confirmPassword: 'Demo1234!',
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

async function call(method, path, body, token) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 200)}`);
  }
  return json;
}

async function registerOrLogin() {
  try {
    const reg = await call('POST', '/users/register', DEMO);
    console.log('  registered new user');
    return reg.data.token;
  } catch (e) {
    const msg = String(e);
    if (msg.includes('Already Exists') || msg.includes('already exists') || msg.includes('Duplicate') || msg.includes('409') || msg.includes('400')) {
      console.log('  user exists, logging in');
      const login = await call('POST', '/users/login', { email: DEMO.email, password: DEMO.password });
      return login.data.token;
    }
    throw e;
  }
}

const SELLERS = [
  { name: 'Acme Wholesale',     email: 'orders@acme.example.com',     contactNo: '+1-555-0101' },
  { name: 'Globex Distributors', email: 'sales@globex.example.com',    contactNo: '+1-555-0102' },
  { name: 'Initech Supply',      email: 'hello@initech.example.com',   contactNo: '+1-555-0103' },
  { name: 'Umbrella Imports',    email: 'imports@umbrella.example.com',contactNo: '+1-555-0104' },
  { name: 'Stark Trading Co.',   email: 'trade@stark.example.com',     contactNo: '+1-555-0105' },
  { name: 'Wayne Logistics',     email: 'ops@wayne.example.com',       contactNo: '+1-555-0106' },
  { name: 'Pied Piper Goods',    email: 'goods@piedpiper.example.com', contactNo: '+1-555-0107' },
  { name: 'Hooli Vendors',       email: 'vendors@hooli.example.com',   contactNo: '+1-555-0108' },
];

const CATEGORIES = ['Electronics', 'Apparel', 'Home & Kitchen', 'Sports', 'Books', 'Toys', 'Beauty', 'Office'];
const BRANDS     = ['Nimbus', 'Vertex', 'Polaris', 'Aurora', 'Comet', 'Helix', 'Quanta', 'Solace', 'Rivet', 'Tempo'];

const PRODUCT_NAMES_BY_CATEGORY = {
  Electronics:    ['Wireless Headphones', 'Bluetooth Speaker', 'USB-C Hub', 'Mechanical Keyboard', 'Webcam 1080p', 'Smartwatch', 'Power Bank 20000mAh', 'LED Desk Lamp'],
  Apparel:        ['Cotton T-Shirt', 'Denim Jacket', 'Running Shorts', 'Wool Beanie', 'Leather Belt', 'Crew Socks', 'Hoodie', 'Cargo Pants'],
  'Home & Kitchen': ['Ceramic Mug', 'Cast Iron Skillet', 'Bamboo Cutting Board', 'Glass Storage Set', 'French Press', 'Knife Block', 'Throw Blanket', 'Scented Candle'],
  Sports:         ['Yoga Mat', 'Resistance Bands', 'Tennis Balls', 'Basketball', 'Jump Rope', 'Dumbbell 10lb', 'Foam Roller', 'Water Bottle 1L'],
  Books:          ['Pocket Notebook', 'Paperback Novel', 'Cookbook', 'Travel Guide', 'Fountain Pen', 'Journal A5', 'Highlighter Pack', 'Bookmark Set'],
  Toys:           ['Building Blocks', 'Plush Bear', 'Puzzle 1000pc', 'RC Car', 'Board Game', 'Action Figure', 'Card Deck', 'Slinky'],
  Beauty:         ['Hand Cream', 'Face Serum', 'Lip Balm', 'Shampoo Bar', 'Hair Brush', 'Nail File Set', 'Cotton Pads', 'Facial Mask'],
  Office:         ['Sticky Notes', 'Stapler', 'Paper Shredder', 'Whiteboard', 'Folder Pack', 'Binder Clips', 'Tape Dispenser', 'Pen Set'],
};

const SIZES = ['SMALL', 'MEDIUM', 'LARGE', null];

const BUYERS = [
  'Alex Johnson', 'Priya Patel', 'Marcus Lee', 'Sofia Garcia', 'Daniel Kim',
  'Emma Wilson', 'Yusuf Khan', 'Olivia Brown', 'Liam Davis', 'Mei Chen',
  'Noah Martinez', 'Ava Nguyen', 'Ethan Walker', 'Isabella Rossi', 'Mason Carter',
];

async function main() {
  console.log('Logging in / registering demo account...');
  const token = await registerOrLogin();

  console.log('\nCreating sellers...');
  const sellers = [];
  for (const s of SELLERS) {
    const r = await call('POST', '/sellers', s, token);
    sellers.push(r.data);
    console.log(`  + ${s.name}`);
  }

  console.log('\nCreating categories...');
  const categories = [];
  for (const name of CATEGORIES) {
    const r = await call('POST', '/categories', { name }, token);
    categories.push(r.data);
    console.log(`  + ${name}`);
  }

  console.log('\nCreating brands...');
  const brands = [];
  for (const name of BRANDS) {
    const r = await call('POST', '/brands', { name }, token);
    brands.push(r.data);
    console.log(`  + ${name}`);
  }

  console.log('\nCreating products...');
  const products = [];
  for (const cat of categories) {
    const names = PRODUCT_NAMES_BY_CATEGORY[cat.name] || [];
    for (const productName of names) {
      const seller = pick(sellers);
      const brand = pick(brands);
      const size = pick(SIZES);
      const payload = {
        name: productName,
        seller: seller._id,
        category: cat._id,
        brand: brand._id,
        price: rand(8, 350),
        stock: rand(10, 200),
      };
      if (size) payload.size = size;
      const r = await call('POST', '/products', payload, token);
      const created = Array.isArray(r.data) ? r.data[0] : r.data;
      products.push({ ...created, _seller: seller, _brand: brand, _category: cat });
    }
  }
  console.log(`  created ${products.length} products`);

  console.log('\nCreating sales...');
  let salesCreated = 0;
  for (let i = 0; i < 60; i++) {
    const product = pick(products);
    const quantity = rand(1, 5);
    const daysBack = rand(0, 60);
    const date = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
    try {
      await call('POST', '/sales', {
        product: product._id,
        productName: product.name,
        quantity,
        productPrice: product.price,
        buyerName: pick(BUYERS),
        date,
      }, token);
      salesCreated++;
    } catch (e) {
      // Skip if a product just ran out of stock
      if (!String(e).includes('stock')) throw e;
    }
  }
  console.log(`  created ${salesCreated} sales`);

  console.log('\nCreating purchases...');
  let purchasesCreated = 0;
  for (let i = 0; i < 30; i++) {
    const product = pick(products);
    const quantity = rand(5, 40);
    const unitPrice = Math.max(1, Math.round(product.price * 0.6));
    const paid = rand(0, 1) ? quantity * unitPrice : Math.round(quantity * unitPrice * 0.5);
    await call('POST', '/purchases', {
      seller:      product._seller._id,
      product:     product._id,
      sellerName:  product._seller.name,
      productName: product.name,
      quantity,
      unitPrice,
      paid,
    }, token);
    purchasesCreated++;
  }
  console.log(`  created ${purchasesCreated} purchases`);

  console.log('\n✓ Done.');
  console.log(`\n  Login: ${DEMO.email}  /  ${DEMO.password}`);
}

main().catch((err) => {
  console.error('\n✗ Seed failed:', err.message);
  process.exit(1);
});
