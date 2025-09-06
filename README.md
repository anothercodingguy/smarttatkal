🚄 SmartTatkal

SmartTatkal is a Tatkal booking assistant web app built with Next.js, TailwindCSS, Node.js (Express), and MongoDB.
It is designed to make Indian Railway Tatkal bookings faster, smarter, and more reliable by providing a smooth UI and backend API integration.

✨ Features

🔐 User Authentication (login/signup)

📑 Passenger Data Management – Save passenger details securely

⚡ Fast Autofill – Quickly fill IRCTC forms

🌐 Responsive UI with TailwindCSS

🔗 Frontend–Backend Integration using REST APIs

🚀 Deployed on Vercel (Frontend) + Render (Backend)

🛠 Tech Stack

Frontend:

Next.js 15

React 19

TailwindCSS 4

Lucide Icons

Backend:

Node.js

Express.js

MongoDB

Deployment:

Frontend → Vercel

Backend → Render

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/anothercodingguy/smarttatkal.git
cd smarttatkal/my-app

2️⃣ Install Dependencies
npm install

3️⃣ Run Development Server
npm run dev


Now open http://localhost:3000
 🎉

📦 Build & Deployment
For Production Build:
npm run build
npm start

Vercel Deployment

Push your code to GitHub

Connect repo to Vercel

Configure environment variables:

NEXT_PUBLIC_API_URL = https://smarttatkal-backend.onrender.com

Backend Deployment

Deploy server/ folder to Render

Ensure MongoDB connection string is set in environment variables

🌍 Environment Variables

Create a .env.local file in my-app/ for frontend:

NEXT_PUBLIC_API_URL=https://smarttatkal-backend.onrender.com


For backend (server/.env):

MONGO_URI=your_mongo_connection_string
PORT=5000

📂 Project Structure
smarttatkal/
│
├── my-app/              # Next.js frontend
│   ├── app/             # App Router pages
│   ├── styles/          # TailwindCSS + globals.css
│   ├── public/          # Static assets
│   ├── package.json     
│   └── ...
│
└── server/              # Express backend
    ├── routes/          # API routes
    ├── utils/           # Helpers
    ├── data/            # Temp storage / seeds
    ├── server.js        # Entry point
    └── package.json

🤝 Contributing

Contributions are welcome! 🎉

Fork the repo

Create a new branch (feature/my-feature)

Commit your changes

Push to your branch

Open a Pull Request

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Made with ❤️ by Suyash Singh
