# DevCollab - Developer Project Showcase & Peer Review Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8" alt="Tailwind">
  <img src="https://img.shields.io/badge/Firebase-10.8-ffca28" alt="Firebase">
  <img src="https://img.shields.io/badge/Vite-6.0-646cff" alt="Vite">
</p>

> A full-featured web application where developers can showcase their projects, browse work from peers, and receive valuable feedback through reviews and ratings.

## 🚀 Live Demo

[View Live Demo](https://devcollab.vercel.app) *(Deploy your own to see it live)*

## 📸 Screenshots

### Desktop View
![Home Page](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200)

### Mobile View
![Mobile Home](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400)

## ✨ Features

### For All Users
- [x] Browse all projects on the home page
- [x] Search projects by name or technology
- [x] Filter projects by tech stack (React, Vue, Node.js, Python, etc.)
- [x] Sort projects (Latest, Most Reviewed, Highest Rated)
- [x] View detailed project information
- [x] Read reviews and ratings
- [x] View developer profiles

### For Authenticated Users
- [x] Add new projects with full details
- [x] Edit your own projects
- [x] Delete your own projects
- [x] Write reviews on any project
- [x] Rate projects (1-5 stars)
- [x] Edit/delete your own reviews
- [x] Personal dashboard

### Additional Features
- [x] Dark mode support
- [x] Responsive design (mobile-first)
- [x] Error boundaries
- [x] Loading states
- [x] Form validation
- [x] Protected routes

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **Authentication** | Firebase Auth (Google + Email) |
| **Database** | Firebase Firestore |
| **State Management** | React Context API |
| **Forms** | React Hook Form |
| **Icons** | Lucide React |

## 📁 Project Structure

```
DevCollab/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── RatingStars.tsx
│   │   ├── FilterChip.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ErrorBoundary.tsx
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/              # Mock data
│   │   └── mockData.ts
│   ├── firebase/          # Firebase configuration
│   │   └── config.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useHooks.ts
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── ProjectDetails.tsx
│   │   ├── AddProject.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Profile.tsx
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example           # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🏃‍♂️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/devcollab.git
   cd devcollab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Firebase credentials (see Firebase Setup below)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)

2. Create a new project

3. Enable Authentication:
   - Google Sign-in
   - Email/Password

4. Enable Firestore Database:
   - Create database in test mode (or set proper rules)

5. Get your config:
   - Project Settings → General → Your apps
   - Copy the config values to `.env`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist folder
```

## 🎯 Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAuth` | Access authentication state and methods |
| `useTheme` | Access dark/light mode state |
| `useLocalStorage` | Persist data to localStorage |
| `useDebounce` | Debounce search input (300ms) |
| `useFetch` | Reusable data fetching |

## 🔐 API & Data Models

### Project
```typescript
{
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  techStack: string[];
  githubLink: string;
  demoLink?: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  averageRating?: number;
  reviewCount?: number;
}
```

### Review
```typescript
{
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  rating: number;
  reviewText: string;
  createdAt: number;
}
```

## 🧪 Testing (Bonus)

```bash
# Run tests
npm test
```

## 📝 Future Improvements

- [ ] Image upload to Firebase Storage
- [ ] Markdown support for descriptions
- [ ] Like/Upvote system
- [ ] Bookmark/Save projects
- [ ] Activity feed
- [ ] Email notifications
- [ ] Social share buttons
- [ ] PDF portfolio export
- [ ] Convert to Next.js for SSR

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [Lucide Icons](https://lucide.dev)

---

<p align="center">Built with ❤️ using React + TypeScript</p>