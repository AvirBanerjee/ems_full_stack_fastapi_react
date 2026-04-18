from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from pydantic import BaseModel, ConfigDict
from typing import List

from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship

from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta


# -------------------- APP --------------------
app = FastAPI(
    title="Employee Management API",
    version="2.0"
)


# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -------------------- DATABASE --------------------
DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# -------------------- MODELS --------------------
class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

    employs = relationship("EmployDB", back_populates="owner")


class EmployDB(Base):
    __tablename__ = "employs"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String)
    email = Column(String)  # removed unique constraint (optional decision)
    isOnProject = Column(Boolean)
    experience = Column(Integer)
    completed = Column(Integer)
    description = Column(String)

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("UserDB", back_populates="employs")


Base.metadata.create_all(bind=engine)


# -------------------- SCHEMAS (Pydantic v2) --------------------

# request schema (no id here)
class UserCreate(BaseModel):
    fullname: str
    email: str
    password: str


# response schema
class UserResponse(BaseModel):
    id: int
    fullname: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class EmployCreate(BaseModel):
    fullname: str
    email: str
    isOnProject: bool
    experience: int
    completed: int
    description: str


class EmployResponse(EmployCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


# -------------------- SECURITY --------------------
SECRET_KEY = "SUPERSECRETSHHHHHHHHH"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/login"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -------------------- DEPENDENCIES --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Token error")

    user = db.query(UserDB).filter(UserDB.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


API_V1 = "/api/v1"


# -------------------- AUTH ROUTES --------------------

# REGISTER
@app.post(API_V1 + "/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(UserDB).filter(UserDB.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = UserDB(
        fullname=user.fullname,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# LOGIN (OAuth2 form-based)
@app.post(API_V1 + "/login", response_model=Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(UserDB).filter(
        UserDB.email == form_data.username   # username = email
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email")

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    access_token = create_access_token(
        data={"email": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -------------------- DASHBOARD --------------------
@app.get(API_V1 + "/dashboard")
def dashboard(current_user: UserDB = Depends(get_current_user)):
    return {
        "fullname": current_user.fullname,
        "email": current_user.email,
        "total_employs": len(current_user.employs)
    }


# -------------------- EMPLOYEE CRUD --------------------

# CREATE
@app.post(API_V1 + "/employ", response_model=dict)
def create_employ(
    employ: EmployCreate,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    new_employ = EmployDB(
        fullname=employ.fullname,
        email=employ.email,
        isOnProject=employ.isOnProject,
        experience=employ.experience,
        completed=employ.completed,
        description=employ.description,
        owner=current_user
    )

    db.add(new_employ)
    db.commit()

    return {"message": "Employee created successfully"}


# GET ALL
@app.get(API_V1 + "/employs", response_model=List[EmployResponse])
def get_employs(
    current_user: UserDB = Depends(get_current_user)
):
    return current_user.employs


# GET SINGLE (SECURED)
@app.get(API_V1 + "/employ/{id}", response_model=EmployResponse)
def get_employ(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    employ = db.query(EmployDB).filter(
        EmployDB.id == id,
        EmployDB.user_id == current_user.id
    ).first()

    if not employ:
        raise HTTPException(status_code=404, detail="Employee not found")

    return employ


# UPDATE
@app.put(API_V1 + "/employ/{id}")
def update_employ(
    id: int,
    data: EmployCreate,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    employ = db.query(EmployDB).filter(
        EmployDB.id == id,
        EmployDB.user_id == current_user.id
    ).first()

    if not employ:
        raise HTTPException(status_code=404, detail="Employee not found")

    employ.fullname = data.fullname
    employ.email = data.email
    employ.isOnProject = data.isOnProject
    employ.experience = data.experience
    employ.completed = data.completed
    employ.description = data.description

    db.commit()

    return {"message": "Employee updated successfully"}


# DELETE
@app.delete(API_V1 + "/employ/{id}")
def delete_employ(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    employ = db.query(EmployDB).filter(
        EmployDB.id == id,
        EmployDB.user_id == current_user.id
    ).first()

    if not employ:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employ)
    db.commit()

    return {"message": "Employee deleted successfully"}