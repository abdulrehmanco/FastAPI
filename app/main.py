from fastapi import FastAPI
from app.api.routes import blog, auth, user, comment, like, reply
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Blog App",
    description="A simple blog app with CRUD operations built in FastAPI",
    version="1.0.0"
)

# Include our blog router
#This is a testing comment
app.include_router(blog.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(comment.router)
app.include_router(like.router)
app.include_router(reply.router)
