from flask_login import UserMixin
from backend import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import Float
from datetime import datetime


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(80), nullable=False, default='user')

    def __repr__(self):
        return f'<User {self.username}>'
        

#### audio ---------------

class AudioRecord(db.Model):
    __tablename__ = 'audio_record'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con el usuario que sube el audio
    audio_path = db.Column(db.String(255), nullable=False)  # Ruta del archivo de audio
    image_path = db.Column(db.String(255), nullable=True)  # Ruta de la imagen opcional
    audio_metadata = db.Column(JSON, nullable=True)  # Almacena los metadatos en formato JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de creación

    user = db.relationship('User', backref='audio_records')  # Relación para acceder al usuario


class AudioRecordTest(db.Model):
    __tablename__ = 'audio_record_test'
    
    id = db.Column(db.Integer, primary_key=True)
    audio_path = db.Column(db.String(255), nullable=False)  # Ruta del archivo de audio
    image_path = db.Column(db.String(255), nullable=True)  # Ruta de la imagen opcional
    audio_metadata = db.Column(JSON, nullable=True)  # Almacena los metadatos en formato JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de creación



class AudioRecordV(db.Model):
    __tablename__ = 'audio_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con usuarios
    original_audio_name = db.Column(db.String(500), nullable=False)  # Nombre original del archivo
    audio_path = db.Column(db.String(500), nullable=False)  # Ruta del archivo en S3
    title = db.Column(db.String(500), nullable=False)  # Título del audio
    date = db.Column(db.String(10), nullable=True)  # Fecha (YYYY-MM-DD)
    tags = db.Column(JSON, nullable=True)  # Tags como JSON (lista)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de creación

    user = db.relationship('User', backref='user_audio_records', lazy=True)

    def __repr__(self):
        return f'<AudioRecordV {self.original_audio_name}>'



class UserAudioMap(db.Model):
    __tablename__ = 'user_audio_map'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    audio_id = db.Column(db.Integer, db.ForeignKey('audio_records.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha en que se asignó la relación

    # Relaciones
    user = db.relationship('User', backref='audio_map')
    audio = db.relationship('AudioRecordV', backref='user_map')

    def __repr__(self):
        return f'<UserAudioMap UserID={self.user_id} AudioID={self.audio_id}>'
