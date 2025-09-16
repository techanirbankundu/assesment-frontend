# Ragilly Frontend

A Next.js frontend application for the Ragilly industry dashboard platform, supporting tour, travel, and logistics businesses.

## Features

- **Authentication System**: Complete login and registration with JWT tokens
- **Industry-Specific Dashboards**: Tailored interfaces for tour, travel, and logistics businesses
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Modern UI Components**: Built with Radix UI and Lucide React icons

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 8000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" > .env.local
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Registration page
│   └── layout.tsx        # Root layout with AuthProvider
├── components/           # Reusable UI components
│   ├── (module)/        # Page-specific components
│   └── ui/              # Base UI components
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   └── api.ts          # API service layer
└── styles/             # Global styles
```

## API Integration

The frontend communicates with the backend API through the `apiService` in `src/lib/api.ts`. The API service handles:

- User authentication (login/register/logout)
- Token management (access/refresh tokens)
- Dashboard data fetching
- Industry-specific profile management

## Authentication Flow

1. **Registration**: Users can register with industry type selection
2. **Login**: Email/password authentication with JWT tokens
3. **Token Management**: Automatic token refresh and localStorage persistence
4. **Protected Routes**: Dashboard requires authentication
5. **Logout**: Clears tokens and redirects to login

## Industry Types

- **Tour**: Tour & travel businesses
- **Travel**: Travel services
- **Logistics**: Logistics & shipping
- **Other**: General business dashboard

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://127.0.0.1:8000/api)

## Backend Integration

This frontend is designed to work with the Ragilly backend API. Ensure the backend is running on port 8000 with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/:industry` - Get industry-specific dashboard

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Lucide React** - Icons
- **Axios** - HTTP client (available but using fetch)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is part of the Ragilly platform.