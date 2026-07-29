<div align="center">
  <img src="https://res.cloudinary.com/dcd6y2awx/image/upload/v1709673317/PlantSeller/UI%20Images/plant_seller_bg_none.png" alt="Plant Seller Logo" width="200" />
  
  # Plant Seller: Where Green Dreams Come True! 🌿
  
  <p>A full-stack, multi-vendor e-commerce platform for plant enthusiasts, nurseries, and administrators.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  </p>
</div>

---

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

---

## 🌿 About the Project
Explore our lush collection of plants to elevate your living space. From vibrant succulents to elegant ferns, find the perfect green companions to breathe life into your home. **Plant Seller** operates on a multi-vendor architecture, allowing independent nurseries to create their own customizable storefronts, manage inventory, and process orders, all overseen by a robust admin panel.

Let's grow together! 🌱

---

## ✨ Key Features

### 🛒 Customer (User)
* **Authentication:** Secure Login/Signup with JWT.
* **Shopping Experience:** Browse plants, add to cart, save for later, and checkout.
* **Order Tracking:** Track order status in real-time.
* **Profile Management:** Manage addresses, profile details, and preferences.

### 🏪 Nursery (Vendor)
* **Custom Storefront:** Customize your nursery's public profile and store layout.
* **Inventory Management:** Add, edit, and manage plant listings.
* **Order Fulfillment:** Process incoming orders, update shipping statuses, and track income.
* **Analytics:** View sales dashboards and income reports.

### 🛡️ Administrator
* **Global Overview:** Full access to site-wide analytics and performance charts.
* **User & Vendor Management:** Verify nurseries, block/delete rogue users, and impersonate accounts for support.
* **Global Inventory & Orders:** Manage all plants, categories, global orders, and coupon codes.
* **Bulk Actions:** Perform bulk accept/reject/deliver operations securely.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Hooks, Custom Hooks)
- **Redux Toolkit** (State Management)
- **Bootstrap & Sass** (Styling)
- **Ant Design (antd)** (Admin & Dashboard UI Components)
- **Chart.js** (Data Visualization)

### Backend
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (Database & ODM)
- **JWT** (Authentication)
- **Stripe.js** (Payment Gateway)
- **Cloudinary** (Image Hosting)

---

## 📂 Project Architecture

```bash
Plant-Selling-Website/
├── backend/                  # Express.js REST API
│   ├── config/               # Database & external service configs
│   ├── src/
│   │   ├── controllers/      # API Logic (Admin, Auth, Checkout, Nursery, User)
│   │   ├── middleware/       # JWT Auth, Guest Protection, Error Handling
│   │   ├── model/            # Mongoose Schemas (User, Plant, VendorOrder, etc.)
│   │   └── router/           # Express Routes
│   └── index.js              # Entry point
│
└── frontend/                 # React Frontend
    ├── public/
    └── src/
        ├── app/              # Redux Store configuration
        ├── Asset/            # SCSS and static assets
        ├── components/       # Global UI components (Navbar, Footer, etc.)
        ├── features/         # Feature-based modules (Admin, Auth, Checkout, Nursery, User)
        └── pages/            # React Router page containers
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* **Node.js** (v14 or higher recommended)
* **MongoDB** (Local instance or MongoDB Atlas)
* **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/piyushraj2340/Plant-Selling-Website.git
   cd Plant-Selling-Website
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the `backend` directory. You will need to configure the following environment variables:

```env
# Application
PORT=8000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Database Configuration
# The app constructs the URI: mongodb+srv://<COLLECTION_NAME>:<COLLECTION_PASSWORD>@<COLLECTION_NAME>.cbqsaya.mongodb.net/...
COLLECTION_NAME=your_mongodb_username_or_cluster_name
COLLECTION_PASSWORD=your_mongodb_password

# Authentication & Encryption Keys
ACCESS_SECRET_KEY=your_jwt_access_secret
SECRET_KEY=your_jwt_refresh_or_other_secret
ENCRYPTION_KEY=your_32_byte_hex_encryption_key

# Payment Integration (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Image Hosting (Cloudinary)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (SMTP via Google)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_GOOGLE_MAIL_ADDRESS=your_email@gmail.com
SMTP_GOOGLE_APP_PASSWORD=your_google_app_password

# Redis Prefix (Optional)
REDIS_VERCEL_KV_DB=development

# Guest Account & Admin Defaults (Optional)
ADMIN_EMAIL=admin@plantseller.com
ADMIN_PASSWORD=adminpassword
GUEST_ADMIN_EMAIL=guest-admin@plantseller.com
GUEST_NURSERY_EMAIL=guest-seller@plantseller.com
GUEST_USER_EMAIL=guest-user@plantseller.com
```
*(For a complete reference, please follow [Issue #2](https://github.com/piyushraj2340/Plant-Selling-Website/issues/2#issuecomment-2414624938).)*

---

## 💻 Usage

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   *(Runs on http://localhost:8000)*

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm start
   ```
   *(Runs on http://localhost:3000)*

3. **Open your browser** and navigate to `http://localhost:3000`.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ✉️ Contact

**Piyush Raj** - [piyushraj2340@gmail.com](mailto:piyushraj2340@gmail.com)

Project Link: [https://github.com/piyushraj2340/Plant-Selling-Website](https://github.com/piyushraj2340/Plant-Selling-Website)

---
<div align="center">
  <sub>Built with ❤️ by Piyush Raj</sub>
</div>
