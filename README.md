# Meiyi NC News API – (Backend)
### A Reddit-style RESTful API for a news (Node.js/Express/PostgreSQL)

🚀 **[Live Demo](https://meiyi-chen-nc-news.onrender.com/api)**

### **Features**

✔ Full CRUD Operations

- Fetch/create/update/delete articles and comments

- Comment count aggregation

✔ Error Handling (400/404/500 responses)

- Custom error responses (400, 404, 500)

- SQL injection prevention

✔ Testing

- 100% test coverage (Jest + Supertest)

- Happy path + error case testing

### **Tech Stack**

**Backend**: React | Axios | React Router | Context API (state) | CSS3

**Testing**: Jest | React Testing Library

**Database Hosting**: Supabase

**API Deployment**: Render

### **Setup steps**

**1. Check Prerequisites**:
- Node.js v18+ (`node -v`)
- PostgreSQL v15+

**2. Clone this repo**:

git clone https://github.com/MeiyiChen1/Meiyi-NC-News-Backend
cd into the repo

**3. Install dependencies**:

npm install

**4. Database Setup**:

npm run setup-dbs
npm run seed-dev

**5. Database Setup**:

npm start

**For Testing**

Run unit tests:
npm test

how to set up the .env files:
--Create two .env files for your databases:
1. .env.test (for the test database). in this file write 'PGDATABASE = nc_news_test'
2. .env.development (for the development database). in this file write 'PGDATABASE = nc_news'

This allow developer to connect to both databases locally.
