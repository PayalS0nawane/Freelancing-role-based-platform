# GigFlow — Role-Based Freelancing Platform

GigFlow is a full-stack, role-based freelancing platform that connects clients and freelancers in a seamless, real-time environment. Built as an internship project at INNOVEXIS, it supports distinct dashboards and workflows for clients, freelancers, and admins.

---

## 🚀 Live Demo

> Hosted on Firebase Hosting  
> 🔗 https://gigflow-91466.web.app

---

## 📌 Features

### For Clients
- Post projects with budget, deadline, and skill requirements
- Browse and review freelancer proposals
- Hire freelancers and track project progress
- Manage ongoing and completed projects from a dedicated dashboard

### For Freelancers
- Browse available projects and submit proposals
- Track proposal status (pending / accepted / rejected)
- Manage active projects and deliverables
- View earnings and project history

### For Admins
- Manage all users (clients and freelancers)
- Oversee all active projects and transactions
- Platform-wide analytics and moderation tools

### General
- Role-based authentication and protected routes
- Real-time data sync using Firestore
- Fully responsive UI across desktop and mobile

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React.js, Tailwind CSS            |
| Auth        | Firebase Authentication           |
| Database    | Firebase Firestore                |
| Hosting     | Firebase Hosting                  |
| State Mgmt  | React Context API / useState      |
| Routing     | React Router DOM                  |

---

## 📁 Project Structure

```
gigflow/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ClientDashboard.jsx
│   │   ├── FreelancerDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── firebaseConfig.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Firebase project set up at [firebase.google.com](https://firebase.google.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gigflow.git
   cd gigflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   App will run at `http://localhost:5173`

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project and enable:
   - **Authentication** → Email/Password provider
   - **Firestore Database** → Start in test mode (configure rules for production)
   - **Hosting** (for deployment)
3. Copy your Firebase config into `firebaseConfig.js`

---

## 🚢 Deployment

```bash
npm run build
firebase login
firebase init
firebase deploy
```

---

## 🔐 Roles & Access

| Role        | Access Level                          |
|-------------|---------------------------------------|
| Client      | Post projects, manage hires           |
| Freelancer  | Browse & apply for projects           |
| Admin       | Full platform access & moderation     |

Role is assigned at registration and stored in Firestore. Protected routes enforce access control.

