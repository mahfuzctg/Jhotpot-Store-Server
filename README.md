### Jhotpot Store Server

Jhotpot Store is an E-Commerce platform designed to provide a complete online shopping experience for users, vendors, and administrators. It serves as a platform where users can browse and purchase products, vendors can manage their shops and inventories, and administrators can control and monitor the entire system. The application is built to be scalable, high-performance, and secure, with a focus on modern web development technologies.

#### Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: React.js (or Next.js)
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: Aamarpay, Stripe
- **Image Storage**: Cloudinary
- **State Management**: Redux (or Context API)
- **Other Libraries/Tools**: Prisma ORM, Bcrypt, JWT, etc.

### Features
#### User Roles
- **Admin**: Full control over the platform, including user and vendor management, transaction monitoring, and product category management.
- **Vendor**: Can create and manage their shop, add and manage products, view order history, and manage product inventory.
- **Customer**: Can browse products, add items to the cart, apply coupon codes during checkout, compare products, view order history, and follow vendor shops.


#### Credentials
- **Email**: `admin@gmail.com`
- **Password**: `password@A1`
- **Email**: `vendor@gmail.com`
- **Password**: `password@A1`
- **Email**: `customer@gmail.com`
- **Password**: `password@A1`

### Product Details Page
- Product name, price, category, images, and detailed description.
- Shop information with a clickable link to the shop page.
- Related products from the same category.
- Customer reviews and ratings.

### Shop Page
- Vendor shop details, including name and description.
- List of products exclusive to the vendor.
- Customers can add products to their cart directly from the shop page.
- Option to follow or unfollow a shop.

### Cart Functionality
- Products can only be added from one vendor at a time.
- Warning when attempting to add products from another vendor with options to replace or retain the current cart.
- Detailed product information and pricing in the cart.

### Checkout
- Apply coupon codes for discounts.
- Integrated payment processing with Aamarpay or Stripe.

### Order History
- View order history for both vendors and customers.
- For vendors, see a list of all orders for their shop.
- For customers, view a detailed history of all their purchases.

### Vendor Dashboard
- Manage shop information (name, logo, description, etc.).
- Add, edit, duplicate, or delete products.
- View and respond to customer reviews.
- Paginated lists of products and order history.

### Comparison Feature
- Compare up to three products from the same category based on attributes like price, ratings, etc.

### Recent Products Page
- Show the last 10 products viewed by the user.

### Pagination
- Paginated product listings on the homepage, shop page, and "All Products" page to improve performance with large datasets.

### Responsive Design
- Fully responsive design that is optimized for mobile and desktop devices.

### Technical Requirements
#### Backend
- **Authentication**: JWT-based authentication.
- **Database**: PostgreSQL with Prisma ORM.
- **Server**: Node.js with Express.js.
- **Image Uploads**: Cloud storage integration for product images (e.g., Cloudinary).

#### Frontend
- **Framework**: React.js or Next.js with state management via Redux or Context API.
- **Typescript**: Optional but highly encouraged.

### Setup Instructions

#### Prerequisites
- **Node.js**: Make sure you have Node.js installed (v14 or higher recommended).
- **Database**: PostgreSQL (local or cloud-based such as Render, Heroku, etc.).
- **PostgreSQL Client**: (optional but recommended) Install a PostgreSQL client like PgAdmin to manage your database.

### Live Links
- **Client (Frontend)**: [Live Client Link](https://jhotpot-store-client.vercel.app)
- **Server (Backend)**: [Live Server Link](https://jhotpot-store-server.vercel.app)

### GitHub Repositories
- **Client Code (Frontend)**: [GitHub Client Repository](https://github.com/mahfuzctg/Jhotpot-Store-Client)
- **Server Code (Backend)**: [GitHub Server Repository](https://github.com/mahfuzctg/Jhotpot-Store-Server)
