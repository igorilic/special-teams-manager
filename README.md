# Special Teams Manager

A comprehensive web application for football coaches to manage special teams rosters and depth charts, built with Remix, TypeScript, Prisma, and Tailwind CSS.

![Special Teams Manager Screenshot](https://via.placeholder.com/800x450.png?text=Special+Teams+Manager)

## Features

- **Player Roster Management**: Add, edit, and view player information including physical attributes and skills
- **Depth Charts**: Manage depth charts for 5 special teams units:
  - Kickoff Team
  - Kickoff Return Team
  - Punt Team
  - Field Goal/PAT Team
  - Hands Team (onside kick recovery)
- **Multi-Team Depth**: Support for 1st, 2nd, and 3rd team depth for each special teams unit
- **Role-Based Access Control**: Admin and Viewer roles with appropriate permissions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: [Remix](https://remix.run)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database ORM**: [Prisma](https://www.prisma.io)
- **Database**: SQLite (development), PostgreSQL (production)
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com)
- **Authentication**: Custom cookie-based auth with bcrypt password hashing
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn
- Git

### Local Development Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/special-teams-manager.git
cd special-teams-manager
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file and add your own `SESSION_SECRET`.

4. Initialize the database

```bash
npx prisma db push
```

5. Seed the database with demo data

```bash
npx prisma db seed
```

6. Start the development server

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

The seeded database includes two default users:

- **Admin User**
  - Email: <admin@example.com>
  - Password: admin123
- **Viewer User**
  - Email: <viewer@example.com>
  - Password: viewer123

## Project Structure

```
app/
├── components/        # Reusable UI components
├── db/                # Database configuration
├── models/            # Data models and database operations
├── routes/            # Route components and API endpoints
├── styles/            # CSS styles
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
prisma/
├── schema.prisma      # Database schema
└── seed.ts            # Database seed file
```

## Key Features Explained

### Roster Management

The roster view allows coaches to:

- View all players with their physical attributes and special teams roles
- Add new players to the roster
- Edit existing player information
- Search players by name or position

### Depth Chart Management

For each special teams unit, coaches can:

- View a visualization of the current depth chart
- Switch between 1st, 2nd, and 3rd team depths
- Assign players to specific positions
- Remove players from positions
- See position-specific details

### Authentication & Authorization

The application has two user roles:

- **Admin**: Full access to add, edit, and delete players and depth charts
- **Viewer**: Read-only access to view rosters and depth charts

## Deployment

The application is configured for deployment to Vercel:

1. Fork this repository
2. Connect your fork to Vercel
3. Set up required environment variables in Vercel:
   - `DATABASE_URL`: Your production database connection string
   - `SESSION_SECRET`: A secure random string for session management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed for football coaches to streamline special teams management
- Built with modern web technologies for performance and maintainability
- Designed with input from actual coaching staff to meet real-world needshis template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
