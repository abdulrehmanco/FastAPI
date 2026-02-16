from fastapi import FastAPI
from app.api.routes import blog, auth, user, comment, like, reply
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.db import Base, engine

app = FastAPI(
    title="Blog App",
    description="A simple blog app with CRUD operations built in FastAPI",
    version="1.0.0"
)


# Create tables
Base.metadata.create_all(bind=engine)
origins = [
    "http://localhost:5173",   # React (Vite)
    "http://127.0.0.1:5173",
    "http://localhost:5174",   # React (Vite) - alternate port
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE, PATCH
    allow_headers=["*"],   # Authorization, Content-Type
)


app.mount("/media", StaticFiles(directory="app/media"), name="media")



# Include our blog router

app.include_router(blog.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(comment.router)
app.include_router(like.router)
app.include_router(reply.router)






