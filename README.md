# 🏨 Hotel Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## 📌 About the Project

A full-featured hotel management system where users can add hotels, search for hotels, and make bookings. The platform provides a seamless experience for both hotel owners and travelers, ensuring smooth management and reservations.

---

## 📑 Index

- [Features](#-features)
- [Built With](#-built-with)
- [Installation](#-installation)
- [Testing](#-testing)
- [Support](#-support)
- [License](#-license)

---

## 🚀 Features

✅ **Hotel Management**
- Owners can list and manage their hotels
- Update hotel details and availability

✅ **Hotel Search & Booking**
- Users can search hotels based on location and filters
- Book hotels with a streamlined reservation system

✅ **User Authentication**
- Secure login & signup
- Profile management

✅ **Playwright Testing**
- Comprehensive end-to-end testing for reliability

---

## 🛠 Built With

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Testing**: Playwright
- **Payments**: Stripe

---

## 📦 Installation

### Running Locally

#### 1️⃣ Clone the repository

```sh
git clone https://github.com/Shyaminda/Hotel-Management-App.git
cd Hotel-Management-App
```

#### 2️⃣ Install dependencies

```sh
npm install
```

#### 3️⃣ Start the backend

```sh
cd api && npm run dev
```

#### 4️⃣ Start the frontend

```sh
cd ../client && npm run start
```

Your application will run at [http://localhost:5173](http://localhost:5173) 🚀

#### Add .env files

```sh
MONGO=
JWT_SECRET_KEY=
CLIENT_URL= 

#cloudinary variables
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=	
CLOUDINARY_API_SECRET=

#stripe 
STRIPE_API_KEY=

VITE_API_BASE_URL=http://localhost:3000
VITE_STRIPE_PUB_KEY=
```

---

## 🧪 Testing

This project includes **Playwright** for end-to-end testing.

Run the tests using:

```sh
cd api && npm run e2e
```

---

## 💡 Support

If you find this project useful, feel free to ⭐ the repository and contribute.

---

## 📝 License

MIT License – Free to use and modify.
