
import os
import json
import hmac
import hashlib
import secrets
import base64
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from .database import get_db
from .models import UserProfile


SECRET_KEY = os.environ.get(
    "CREDORA_SECRET_KEY",
    "development-only-change-this-credora-secret-key"
)

ALGORITHM = "HS256"
TOKEN_EXPIRE_SECONDS = 60 * 60 * 24 * 7

security_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        310000
    )

    return (
        "pbkdf2_sha256$310000$"
        + base64.b64encode(salt).decode()
        + "$"
        + base64.b64encode(password_hash).decode()
    )


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations, salt, expected_hash = stored_hash.split("$")

        if algorithm != "pbkdf2_sha256":
            return False

        salt_bytes = base64.b64decode(salt)
        expected_bytes = base64.b64decode(expected_hash)

        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt_bytes,
            int(iterations)
        )

        return hmac.compare_digest(actual_hash, expected_bytes)

    except (ValueError, TypeError):
        return False


def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def base64url_decode(data: str) -> bytes:
    return base64.urlsafe_b64decode(
        data + "=" * (-len(data) % 4)
    )


def create_access_token(profile_id: int) -> str:
    header = {
        "alg": ALGORITHM,
        "typ": "JWT"
    }

    payload = {
        "sub": str(profile_id),
        "exp": int(time.time()) + TOKEN_EXPIRE_SECONDS
    }

    encoded_header = base64url_encode(
        json.dumps(header, separators=(",", ":")).encode()
    )

    encoded_payload = base64url_encode(
        json.dumps(payload, separators=(",", ":")).encode()
    )

    message = f"{encoded_header}.{encoded_payload}".encode()

    signature = hmac.new(
        SECRET_KEY.encode(),
        message,
        hashlib.sha256
    ).digest()

    return (
        f"{encoded_header}.{encoded_payload}."
        f"{base64url_encode(signature)}"
    )


def decode_access_token(token: str) -> int:
    try:
        parts = token.split(".")

        if len(parts) != 3:
            raise ValueError("Invalid token")

        encoded_header, encoded_payload, signature = parts

        message = f"{encoded_header}.{encoded_payload}".encode()

        expected_signature = hmac.new(
            SECRET_KEY.encode(),
            message,
            hashlib.sha256
        ).digest()

        actual_signature = base64url_decode(signature)

        if not hmac.compare_digest(
            expected_signature,
            actual_signature
        ):
            raise ValueError("Invalid signature")

        header = json.loads(base64url_decode(encoded_header))

        if header.get("alg") != ALGORITHM:
            raise ValueError("Invalid algorithm")

        payload = json.loads(base64url_decode(encoded_payload))

        if int(payload["exp"]) <= int(time.time()):
            raise ValueError("Token expired")

        return int(payload["sub"])

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )


def get_current_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
):
    profile_id = decode_access_token(credentials.credentials)

    profile = db.query(UserProfile).filter(
        UserProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found"
        )

    return profile
