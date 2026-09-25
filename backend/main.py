from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import engine, SessionLocal
from models import Base, User, Subject, Task
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "StudyMate backend is running!"}


@app.get("/api/test")
def test():
    return {"message": "Frontend and backend connected!"}


class SignupData(BaseModel):
    name: str
    email: str
    password: str


class LoginData(BaseModel):
    email: str
    password: str


class SubjectData(BaseModel):
    name: str
    user_id: int


class TaskData(BaseModel):
    title: str
    user_id: int


# ---------------- SIGNUP ----------------

@app.post("/api/signup")
def signup(user: SignupData):
    db = SessionLocal()

    new_user = User(
        name=user.name,
        email=user.email,
        password=password_hash.hash(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "message": "Account created successfully!",
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }


# ---------------- LOGIN ----------------

@app.post("/api/login")
def login(user: LoginData):
    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        db.close()
        return {"message": "Invalid email or password"}

    if not password_hash.verify(
        user.password,
        existing_user.password
    ):
        db.close()
        return {"message": "Invalid email or password"}

    db.close()

    return {
        "message": "Login successful!",
        "id": existing_user.id,
        "name": existing_user.name,
        "email": existing_user.email
    }


# ---------------- SUBJECTS ----------------

@app.post("/api/subjects")
def add_subject(subject: SubjectData):
    db = SessionLocal()

    new_subject = Subject(
        name=subject.name,
        user_id=subject.user_id
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    db.close()

    return {
        "message": "Subject added successfully!",
        "id": new_subject.id,
        "name": new_subject.name,
        "user_id": new_subject.user_id
    }


@app.get("/api/subjects")
def get_subjects(user_id: int):
    db = SessionLocal()

    subjects = db.query(Subject).filter(
        Subject.user_id == user_id
    ).all()

    result = [
        {
            "id": subject.id,
            "name": subject.name
        }
        for subject in subjects
    ]

    db.close()

    return result


@app.delete("/api/subjects/{subject_id}")
def delete_subject(subject_id: int, user_id: int):
    db = SessionLocal()

    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()

    if not subject:
        db.close()
        return {"message": "Subject not found"}

    db.delete(subject)
    db.commit()
    db.close()

    return {"message": "Subject deleted successfully!"}


@app.put("/api/subjects/{subject_id}")
def update_subject(
    subject_id: int,
    subject_data: SubjectData
):
    db = SessionLocal()

    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == subject_data.user_id
    ).first()

    if not subject:
        db.close()
        return {"message": "Subject not found"}

    subject.name = subject_data.name

    db.commit()
    db.refresh(subject)
    db.close()

    return {
        "message": "Subject updated successfully!",
        "id": subject.id,
        "name": subject.name
    }


# ---------------- TASKS ----------------

@app.post("/api/tasks")
def add_task(task: TaskData):
    db = SessionLocal()

    new_task = Task(
        title=task.title,
        completed=0,
        user_id=task.user_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    db.close()

    return {
        "message": "Task added successfully!",
        "id": new_task.id,
        "title": new_task.title,
        "completed": new_task.completed,
        "user_id": new_task.user_id
    }


@app.get("/api/tasks")
def get_tasks(user_id: int):
    db = SessionLocal()

    tasks = db.query(Task).filter(
        Task.user_id == user_id
    ).all()

    result = [
        {
            "id": task.id,
            "title": task.title,
            "completed": task.completed
        }
        for task in tasks
    ]

    db.close()

    return result


@app.put("/api/tasks/{task_id}/complete")
def complete_task(task_id: int, user_id: int):
    db = SessionLocal()

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id
    ).first()

    if not task:
        db.close()
        return {"message": "Task not found"}

    task.completed = 1 if task.completed == 0 else 0

    db.commit()
    db.refresh(task)
    db.close()

    return {
        "message": "Task status updated!",
        "id": task.id,
        "title": task.title,
        "completed": task.completed
    }


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, user_id: int):
    db = SessionLocal()

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id
    ).first()

    if not task:
        db.close()
        return {"message": "Task not found"}

    db.delete(task)
    db.commit()
    db.close()

    return {"message": "Task deleted successfully!"}