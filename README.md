# Blog App

A full-stack blog application built with **FastAPI** (backend) and **React** (frontend), featuring user authentication, blog post management, comments, likes, and replies.

## 🚀 Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Blog Management**: Create, read, update, and delete blog posts
- **User Profiles**: Manage user profiles and view user information
- **Comments**: Add comments to blog posts
- **Likes**: Like blog posts and comments
- **Replies**: Reply to comments for threaded discussions
- **Media Upload**: Support for uploading and serving media files
- **CORS Enabled**: Configured for seamless frontend-backend communication

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Database
- **Pydantic** - Data validation using Python type annotations
- **python-jose** - JWT token handling
- **bcrypt** - Password hashing
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

## 📁 Project Structure

```
FastAPI/
├── app/
│   ├── api/
│   │   └── routes/          # API route handlers
│   │       ├── auth.py      # Authentication endpoints
│   │       ├── blog.py      # Blog CRUD operations
│   │       ├── user.py      # User management
│   │       ├── comment.py   # Comment operations
│   │       ├── like.py      # Like functionality
│   │       └── reply.py     # Reply to comments
│   ├── core/                # Core configurations
│   ├── crud/                # Database CRUD operations
│   ├── database/            # Database configuration
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── media/               # Uploaded media files
│   └── main.py              # FastAPI application entry point
├── frontend/
│   ├── src/                 # React source files
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── static/                  # Static files
├── requirements.txt         # Python dependencies
└── blog.db                  # SQLite database
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulrehmanco/FastAPI.git
   cd FastAPI
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI server**
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

5. **Access API documentation**
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Blog Posts
- `GET /blogs` - Get all blog posts
- `GET /blogs/{id}` - Get a specific blog post
- `POST /blogs` - Create a new blog post
- `PUT /blogs/{id}` - Update a blog post
- `DELETE /blogs/{id}` - Delete a blog post

### Users
- `GET /users/{id}` - Get user profile
- `PUT /users/{id}` - Update user profile

### Comments
- `GET /blogs/{id}/comments` - Get comments for a blog post
- `POST /blogs/{id}/comments` - Add a comment to a blog post
- `DELETE /comments/{id}` - Delete a comment

### Likes
- `POST /blogs/{id}/like` - Like a blog post
- `DELETE /blogs/{id}/like` - Unlike a blog post

### Replies
- `POST /comments/{id}/reply` - Reply to a comment
- `DELETE /replies/{id}` - Delete a reply

## 🔐 Environment Variables

Create a `.env` file in the root directory (optional, for production):

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🧪 Development

### Running in Development Mode

**Backend:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Abdul Rehman**
- GitHub: [@abdulrehmanco](https://github.com/abdulrehmanco)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/abdulrehmanco/FastAPI/issues).

## ⭐ Show your support

Give a ⭐️ if this project helped you!
