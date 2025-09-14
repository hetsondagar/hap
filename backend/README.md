# HAP Backend API

Backend API for HAP - Youth-focused gamified event discovery platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Event Management**: CRUD operations for events with geospatial queries
- **Gamification**: Points, badges, achievements, and leaderboards
- **Social Features**: Friends, groups, chat, and notifications
- **Real-time Updates**: WebSocket support for live chat and notifications
- **Rewards System**: Virtual wallet and reward marketplace
- **Map Integration**: Location-based event discovery
- **Analytics**: Event and user analytics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.IO
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hap
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/logout` | Logout user | Private |
| PATCH | `/api/auth/update-profile` | Update user profile | Private |
| PATCH | `/api/auth/change-password` | Change password | Private |

### Event Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/events` | Get all events | Public |
| GET | `/api/events/:id` | Get single event | Public |
| POST | `/api/events` | Create event | Private (Organizer) |
| PATCH | `/api/events/:id` | Update event | Private (Organizer) |
| DELETE | `/api/events/:id` | Delete event | Private (Organizer) |
| POST | `/api/events/:id/join` | Join event | Private |
| DELETE | `/api/events/:id/leave` | Leave event | Private |
| POST | `/api/events/:id/checkin` | Check in to event | Private |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Private (Admin) |
| GET | `/api/users/:id` | Get user profile | Public |
| PATCH | `/api/users/:id` | Update user | Private |
| GET | `/api/users/:id/stats` | Get user stats | Private |
| GET | `/api/users/:id/friends` | Get user friends | Private |
| POST | `/api/users/:id/friends` | Add friend | Private |

### Group Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/groups` | Get all groups | Public |
| GET | `/api/groups/:id` | Get group details | Public |
| POST | `/api/groups` | Create group | Private |
| POST | `/api/groups/:id/join` | Join group | Private |
| DELETE | `/api/groups/:id/leave` | Leave group | Private |

### Leaderboard Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/leaderboard` | Get leaderboard | Public |
| GET | `/api/leaderboard/my-rank` | Get user rank | Private |
| GET | `/api/leaderboard/earners` | Get top earners | Public |
| GET | `/api/leaderboard/spenders` | Get top spenders | Public |

### Rewards Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/rewards` | Get all rewards | Public |
| GET | `/api/rewards/:id` | Get reward details | Public |
| POST | `/api/rewards/:id/redeem` | Redeem reward | Private |
| GET | `/api/rewards/my/redeemed` | Get redeemed rewards | Private |

### Wallet Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/wallet/:userId` | Get wallet balance | Private |
| GET | `/api/wallet/:userId/transactions` | Get transaction history | Private |
| POST | `/api/wallet/:userId/add` | Add points | Private |
| POST | `/api/wallet/:userId/transfer` | Transfer points | Private |

### Notification Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/notifications/:userId` | Get notifications | Private |
| PATCH | `/api/notifications/:id/read` | Mark as read | Private |
| PATCH | `/api/notifications/:userId/read-all` | Mark all as read | Private |

### Map Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/map/nearby` | Get nearby events | Public |
| GET | `/api/map/category/:category` | Get events by category | Public |
| GET | `/api/map/date/:date` | Get events by date | Public |
| GET | `/api/map/popular-locations` | Get popular locations | Public |

## 🔌 WebSocket Events

### Client to Server

- `join_event_chat` - Join event chat room
- `join_group_chat` - Join group chat room
- `send_event_message` - Send message to event chat
- `send_group_message` - Send message to group chat
- `mark_messages_read` - Mark messages as read
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `join_leaderboard` - Join leaderboard updates
- `join_notifications` - Join notification updates

### Server to Client

- `new_message` - New message received
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing
- `new_notification` - New notification
- `leaderboard_update` - Leaderboard updated
- `event_update` - Event updated
- `group_update` - Group updated

## 🗄️ Database Schema

### User
- Basic info (username, email, password)
- Gamification stats (points, level, badges, achievements)
- Social features (friends, groups, preferences)
- Profile information

### Event
- Event details (title, description, category)
- Date/time and location (with GeoJSON)
- Organizer and attendees
- Gamification settings
- Analytics

### Group
- Group info and settings
- Members and invitations
- Event association
- Activity tracking

### Badge/Achievement
- Requirements and rewards
- Rarity and categories
- Unlock conditions

### Reward
- Reward details and pricing
- Availability and redemption
- Partner information

### Wallet
- Balance and transaction history
- Monthly statistics
- Settings

### Notification
- Message and metadata
- Read status and priority
- Action buttons

### Chat
- Messages and participants
- Real-time features
- Moderation settings

## 🔒 Security Features

- JWT authentication with refresh tokens
- Role-based access control (User, Admin, Organizer)
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- XSS protection
- NoSQL injection prevention

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error handling and logging
- Performance monitoring

## 🚀 Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@hap.com or create an issue in the repository.
