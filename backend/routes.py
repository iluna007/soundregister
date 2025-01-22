# backend/routes.py

import os
import json
from flask import Blueprint, request, jsonify, render_template,redirect, url_for, flash, get_flashed_messages, session
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash,check_password_hash
from backend import app, db
from backend.models import User, AudioRecord,AudioRecordV
from datetime import datetime
from backend.forms import SignupForm, SigninForm
import boto3
import cloudinary.uploader


# JSON Web Tokens
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager


bp = Blueprint('api', __name__)

# Blueprint para las vistas principales de flask
bp_main = Blueprint('main', __name__)

# Configurar el cliente S3 usando las variables de entorno
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

# Nombre del bucket de S3
bucket_name = 'sound-register-gs-bucket-1'  # Cambia este valor por el nombre real de tu bucket


# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

# ----------------------    VIEWS    ----------------------

# ----------------------   BACKEND   ----------------------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/users")
def users():
    # Consultar todos los usuarios
    users = User.query.all()
    return render_template("users.html", users=users)

@app.route("/users/<int:user_id>/files", methods=["GET"])
def user_files(user_id):
    """Renderiza la página de archivos subidos por un usuario."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_files = AudioRecordV.query.filter_by(user_id=user_id).all()
    return render_template("user_files.html", user=user, user_files=user_files)


@app.route("/audios", methods=["GET", "POST"])
def audios():
    """Renderiza la página de audios con los datos de S3."""
    try:
        # Obtener la lista de archivos desde S3
        response = s3.list_objects_v2(Bucket=bucket_name)
        files = []

        if 'Contents' in response:
            for content in response['Contents']:
                files.append(content['Key'])  # Obtener el nombre de cada archivo

        # Renderizar el HTML con los archivos
        return render_template("audios.html", files=files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------                USERS                  ----------------------

# ----------------------    CREATE, EDIT OR ELIMINATE USERS    ----------------------

@app.route("/users/create", methods=["GET", "POST"])
def create_user():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        password_hash = generate_password_hash(password)

        new_user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()

        flash("User created successfully!", "success")
        return redirect(url_for("users"))

    return render_template("create_user.html")

# Ruta para editar un usuario existente
@app.route("/users/edit/<int:user_id>", methods=["GET", "POST"])
def edit_user(user_id):
    user = User.query.get_or_404(user_id)

    if request.method == "POST":
        user.username = request.form.get("username")
        user.email = request.form.get("email")
        password = request.form.get("password")
        if password:  # Solo actualizar la contraseña si se proporciona
            user.password_hash = generate_password_hash(password)

        db.session.commit()

        flash("User updated successfully!", "success")
        return redirect(url_for("users"))

    return render_template("edit_user.html", user=user)

# Ruta para eliminar un usuario
@app.route("/users/delete/<int:user_id>", methods=["POST"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    flash("User deleted successfully!", "danger")
    return redirect(url_for("users"))
# ----------------------------------------------------------------------------------------------------------------
# 							ENDPOINTS
# ----------------------------------------------------------------------------------------------------------------

# test endpoint for React
@bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'}), 200

# ----------------------
# USER ROUTES
# ----------------------

@bp.route('/users', methods=['POST'])
def create_user():
    """
    Create a new user
    ---
    tags:
      - Users
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
              example: "john_doe"
              description: "The username of the new user"
            email:
              type: string
              example: "john.doe@example.com"
              description: "The email address of the new user"
            password:
              type: string
              example: "password123"
              description: "The password for the new user"
    responses:
      201:
        description: User created successfully
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
            message:
              type: string
              example: "User created successfully!"
      400:
        description: Missing required fields
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Missing required fields"
      409:
        description: Username or email already exists
        schema:
          type: object
          properties:
            message:
              type: string
              example: "This email is already registered"
    """
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Verificar campos requeridos
    if not username or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    # Verificar si el correo ya existe
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({"message": "This email is already registered"}), 409

    # Verificar si el nombre de usuario ya existe
    existing_username = User.query.filter_by(username=username).first()
    if existing_username:
        return jsonify({"message": "This username is already taken"}), 409

    # Crear el usuario
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"id": user.id, "message": "User created successfully!"}), 201


@bp.route('/users', methods=['GET'])
def get_all_users():
    """
    Get all users
    ---
    tags:
      - Users
    responses:
      200:
        description: List of all users
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 1
              username:
                type: string
                example: "john_doe"
              email:
                type: string
                example: "john.doe@example.com"
              role:
                type: string
                example: "admin"
    """
    users = User.query.all()
    return jsonify([
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
        for user in users
    ])

    
# @bp.route('/users', methods=['GET'])
# def get_all_users():

#     users = User.query.all()
#     return jsonify([
#         {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'role': user.role
#         }
#         for user in users
#     ])



@bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get user details by ID
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: ID of the user to retrieve
    responses:
      200:
        description: User details
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
            username:
              type: string
              example: "john_doe"
            email:
              type: string
              example: "john.doe@example.com"
            role:
              type: string
              example: "admin"
      404:
        description: User not found
        schema:
          type: object
          properties:
            message:
              type: string
              example: "User not found"
    """
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    })

# @bp.route('/users/<int:user_id>', methods=['PUT'])
# def update_user(user_id):
#     data = request.get_json()
#     user = User.query.get(user_id)
#     if user is None:
#         return jsonify({'message': 'User not found'}), 404

#     # Actualizar solo los campos presentes en la solicitud
#     if 'username' in data:
#         user.username = data['username']
#     if 'email' in data:
#         user.email = data['email']
#     if 'role' in data:
#         user.role = data['role']
#     if 'password_hash' in data:
#         user.password_hash = data['password_hash']

#     db.session.commit()
#     return jsonify({'message': 'User updated'})
def update_user(user_id):
    """
    Update user details by ID
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: ID of the user to update
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
              example: "john_doe_updated"
            email:
              type: string
              example: "john.doe.updated@example.com"
            role:
              type: string
              example: "user"
            password_hash:
              type: string
              example: "hashed_password"
    responses:
      200:
        description: User updated successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "User updated"
      404:
        description: User not found
        schema:
          type: object
          properties:
            message:
              type: string
              example: "User not found"
    """
    data = request.get_json()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    # Actualizar solo los campos presentes en la solicitud
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data:
        user.role = data['role']
    if 'password_hash' in data:
        user.password_hash = data['password_hash']

    db.session.commit()
    return jsonify({'message': 'User updated'})


@bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a user by ID
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: ID of the user to delete
    responses:
      200:
        description: User deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "User deleted"
      404:
        description: User not found
        schema:
          type: object
          properties:
            message:
              type: string
              example: "User not found"
    """
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

# @bp.route('/users/<int:user_id>', methods=['DELETE'])
# def delete_user(user_id):
#     user = User.query.get(user_id)
#     if user is None:
#         return jsonify({'message': 'User not found'}), 404
#     db.session.delete(user)
#     db.session.commit()
#     return jsonify({'message': 'User deleted'})

# ----------------------                AUDIOS                  ----------------------

# ----------------------    UPLOAD, EDIT OR ELIMINATE AUDIOS    ----------------------


@bp.route('/upload-files', methods=['POST'])
@jwt_required()  # Verificar que el token es válido
def upload_file():
    """
    Upload an audio file
    ---
    tags:
      - Files
    security:
      - bearerAuth: []
    parameters:
      - name: audio
        in: formData
        type: file
        required: true
        description: The audio file to upload
      - name: title
        in: formData
        type: string
        required: false
        description: The title of the audio file
        example: "Nature Sounds"
      - name: date
        in: formData
        type: string
        required: false
        description: The date of the recording (optional)
        example: "2025-01-22"
      - name: tags
        in: formData
        type: string
        required: false
        description: JSON string containing tags for the file
        example: '["nature", "forest", "birds"]'
    responses:
      201:
        description: File uploaded successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "File uploaded successfully"
            file_name:
              type: string
              example: "d41d8cd98f00b204e9800998ecf8427e.mp3"
            metadata:
              type: object
              properties:
                title:
                  type: string
                  example: "Nature Sounds"
                date:
                  type: string
                  example: "2025-01-22"
                tags:
                  type: array
                  items:
                    type: string
                  example: ["nature", "forest", "birds"]
      400:
        description: Bad request (missing or invalid fields)
        schema:
          type: object
          properties:
            error:
              type: string
              example: "No audio file provided"
      401:
        description: Unauthorized (invalid or missing token)
        schema:
          type: object
          properties:
            error:
              type: string
              example: "User not authenticated"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "An unexpected error occurred"
    """
    try:
        # Obtener el user_id desde el token JWT
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401

        # Verificar si se proporciona un archivo
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        file = request.files['audio']

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Capturar metadata desde el formulario
        metadata = request.form.to_dict()

        # Limpieza de campos de metadata
        metadata['date'] = metadata.get('date', '').strip()
        metadata['title'] = metadata.get('title', '').strip()

        # Asegurar que tags es un JSON válido
        if 'tags' in metadata and isinstance(metadata['tags'], str):
            try:
                metadata['tags'] = json.loads(metadata['tags'])
            except json.JSONDecodeError:
                return jsonify({"error": "Invalid tags format. Must be a JSON string."}), 400

        # Generar nombre único
        file_extension = file.filename.split('.')[-1].lower()
        unique_filename = f"{os.urandom(16).hex()}.{file_extension}"

        # Subir a AWS S3
        s3.upload_fileobj(
            file,
            bucket_name,
            unique_filename,
            ExtraArgs={'ContentType': file.content_type}
        )

        # Guardar en la base de datos
        audio_record = AudioRecordV(
            user_id=user_id,
            original_audio_name=file.filename,
            audio_path=unique_filename,
            title=metadata.get('title'),
            date=metadata.get('date'),
            tags=metadata.get('tags'),
        )
        db.session.add(audio_record)
        db.session.commit()

        return jsonify({
            "message": "File uploaded successfully",
            "file_name": unique_filename,
            "metadata": metadata
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500





# listar elementos en aws bucket
@bp.route('/list-files', methods=['GET'])
def list_files():
    """
    List all audio files
    ---
    tags:
      - Files
    responses:
      200:
        description: List of audio files with metadata
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 1
                description: "ID of the audio file"
              audio_path:
                type: string
                example: "https://bucket-name.s3.amazonaws.com/unique_file.mp3"
                description: "Presigned URL for temporary access to the file"
              title:
                type: string
                example: "Nature Sounds"
                description: "Title of the audio file"
              tags:
                type: array
                items:
                  type: string
                example: ["nature", "forest", "birds"]
                description: "Tags associated with the audio file"
              user_name:
                type: string
                example: "john_doe"
                description: "Username of the file owner"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "An unexpected error occurred"
    """
    try:
        files = AudioRecordV.query.join(User).add_columns(
            AudioRecordV.id,
            AudioRecordV.audio_path,
            AudioRecordV.title,
            AudioRecordV.tags,
            User.username
        ).all()

        result = []
        for file in files:
            # Garantizar que tags sea un array
            tags = file.tags
            if isinstance(tags, str):
                try:
                    tags = json.loads(tags)
                except json.JSONDecodeError:
                    tags = []

            # Generar URL firmada para acceso temporal
            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': bucket_name, 'Key': file.audio_path},
                ExpiresIn=3600  # La URL será válida por 1 hora
            )

            audio_data = {
                "id": file.id,
                "audio_path": presigned_url,  # Usar URL firmada
                "title": file.title,
                "tags": tags,
                "user_name": file.username,
            }
            result.append(audio_data)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500








@bp.route('/delete/<filename>', methods=['POST'])
def delete_file(filename):
    """
    Delete a file from the S3 bucket
    ---
    tags:
      - Files
    parameters:
      - name: filename
        in: path
        type: string
        required: true
        description: The name of the file to delete from the S3 bucket
        example: "unique_file.mp3"
    responses:
      200:
        description: File deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "File unique_file.mp3 deleted successfully"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Error deleting file: File not found"
    """
    
    try:
        # Eliminar el archivo del bucket de S3
        s3.delete_object(Bucket=bucket_name, Key=filename)
        return jsonify({
            "message": f"File {filename} deleted successfully"
        }), 200

    except Exception as e:
        return jsonify({"error": f"Error deleting file: {str(e)}"}), 500


@bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    """
    Generate a presigned URL to download or view a file from S3
    ---
    tags:
      - Files
    parameters:
      - name: filename
        in: path
        type: string
        required: true
        description: The name of the file to generate a presigned URL for
        example: "unique_file.mp3"
    responses:
      302:
        description: Redirect to the presigned URL for the file
        headers:
          Location:
            description: The presigned URL for the file
            type: string
            example: "https://bucket-name.s3.amazonaws.com/unique_file.mp3?X-Amz-Security-Token=..."
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Error generating presigned URL"
    """   
    try:
        file_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': filename},
            ExpiresIn=3600  # La URL será válida por 1 hora
        )
        return redirect(file_url)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------
# AUDIO METADATA RECORDS
# ----------------------

@bp.route('/save-audio-record', methods=['POST'])
def save_audio_record():
    """
    Save an audio record
    ---
    tags:
      - Audio Records
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            original_audio_name:
              type: string
              example: "recording.mp3"
              description: The original name of the audio file
            audio_path:
              type: string
              example: "audio/unique_file.mp3"
              description: The path to the audio file
            image_path:
              type: string
              example: "images/thumbnail.jpg"
              description: (Optional) Path to the associated image
            date:
              type: string
              example: "2025-01-22"
              description: (Optional) Date of the recording
            tags:
              type: array
              items:
                type: string
              example: ["nature", "birds", "morning"]
              description: (Optional) Tags associated with the audio file
    responses:
      201:
        description: Audio record saved successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Audio record saved successfully!"
      400:
        description: Missing required fields
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Missing required field: original_audio_name"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "An unexpected error occurred"
    """

    try:
        data = request.json  # Obtener los datos del cliente (React)

        # Validar que los campos requeridos estén presentes
        required_fields = ['original_audio_name', 'audio_path']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Crear un nuevo registro en la base de datos
        new_record = AudioRecordV(
            original_audio_name=data['original_audio_name'],
            audio_path=data['audio_path'],
            image_path=data.get('image_path'),  # Opcional
            date=data.get('date'),
            time=data.get('time'),
            location=data.get('location'),
            conditions=data.get('conditions'),
            temperature=data.get('temperature'),
            wind_speed=data.get('wind_speed'),
            wind_direction=data.get('wind_direction'),
            recordist=data.get('recordist'),
            notes=data.get('notes'),
            tags=data.get('tags'),
        )

        # Guardar en la base de datos
        db.session.add(new_record)
        db.session.commit()

        return jsonify({"message": "Audio record saved successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/delete-audio-record/<int:record_id>', methods=['POST'])
def delete_audio_record(record_id):
    """
    Delete an audio record
    ---
    tags:
      - Audio Records
    parameters:
      - name: record_id
        in: path
        type: integer
        required: true
        description: ID of the audio record to delete
    responses:
      200:
        description: Audio record deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Audio record and associated file deleted successfully!"
      404:
        description: Audio record not found
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Audio record not found"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Error deleting file in S3: File not found"
    """

    try:
        # Buscar el registro en la base de datos
        record = AudioRecordV.query.get(record_id)
        if not record:
            return jsonify({"error": "Audio record not found"}), 404

        # Eliminar el archivo del bucket S3
        if record.audio_path:
            try:
                s3.delete_object(Bucket=bucket_name, Key=record.audio_path)
            except Exception as e:
                return jsonify({"error": f"Error deleting file in S3: {str(e)}"}), 500

        # Eliminar el registro de la base de datos
        db.session.delete(record)
        db.session.commit()

        return jsonify({"message": "Audio record and associated file deleted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/list-audio-records', methods=['GET'])
def list_audio_records():
    """
    List all audio records
    ---
    tags:
      - Audio Records
    responses:
      200:
        description: List of audio records with metadata
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 1
              original_audio_name:
                type: string
                example: "recording.mp3"
              audio_path:
                type: string
                example: "audio/unique_file.mp3"
              date:
                type: string
                example: "2025-01-22"
              tags:
                type: array
                items:
                  type: string
                example: ["nature", "birds"]
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "An unexpected error occurred"
    """
    try:
        records = AudioRecordV.query.all()
        result = [
            {
                "id": record.id,
                "original_audio_name": record.original_audio_name,
                "audio_path": record.audio_path,
                "image_path": record.image_path,
                "date": record.date,
                "time": record.time,
                "location": record.location,
                "conditions": record.conditions,
                "temperature": record.temperature,
                "wind_speed": record.wind_speed,
                "wind_direction": record.wind_direction,
                "recordist": record.recordist,
                "notes": record.notes,
                "tags": record.tags,
            }
            for record in records
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/audio-record/<int:id>', methods=['GET'])
def get_audio_record(id):
    """
    Get details of an audio record by ID
    ---
    tags:
      - Audio Records
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: ID of the audio record to retrieve
        example: 1
    responses:
      200:
        description: Audio record details
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
            title:
              type: string
              example: "Nature Sounds"
            audio_path:
              type: string
              example: "https://bucket-name.s3.amazonaws.com/unique_file.mp3"
            user_name:
              type: string
              example: "john_doe"
            tags:
              type: array
              items:
                type: string
              example: ["nature", "birds", "morning"]
            date:
              type: string
              example: "2025-01-22"
            created_at:
              type: string
              example: "2025-01-20T10:30:00"
      404:
        description: Audio record not found
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Audio record not found"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "An unexpected error occurred"
    """
    try:
        record = AudioRecordV.query.get(id)
        if not record:
            return jsonify({"error": "Audio record not found"}), 404

        # Generar URL pública para el archivo
        audio_url = f"https://{bucket_name}.s3.amazonaws.com/{record.audio_path}"

        result = {
            "id": record.id,
            "title": record.title,
            "audio_path": audio_url,
            "user_name": record.user.username if record.user else "Unknown",
            "tags": record.tags,
            "date": record.date,
            "created_at": record.created_at,
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/list-audio-records/<int:user_id>', methods=['GET'])
def list_audio_records_by_user(user_id):
    """
    List all audio records for a specific user
    ---
    tags:
      - Audio Records
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: ID of the user whose audio records to retrieve
        example: 123
    responses:
      200:
        description: List of audio records for the user
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 1
              user_id:
                type: integer
                example: 123
              original_audio_name:
                type: string
                example: "recording.mp3"
              audio_path:
                type: string
                example: "audio/unique_file.mp3"
              title:
                type: string
                example: "Rainforest Sounds"
              date:
                type: string
                example: "2025-01-22"
              tags:
                type: array
                items:
                  type: string
                example: ["nature", "birds", "rainforest"]
              created_at:
                type: string
                example: "2025-01-20T10:30:00"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "An unexpected error occurred"
    """
    try:
        records = AudioRecordV.query.filter_by(user_id=user_id).all()
        result = []
        for record in records:
            # Asegurarse de que los tags son un array
            if isinstance(record.tags, str):
                try:
                    tags = json.loads(record.tags)
                except json.JSONDecodeError:
                    tags = []  # Si no se puede parsear, asignar un array vacío
            else:
                tags = record.tags if isinstance(record.tags, list) else []

            audio_data = {
                "id": record.id,
                "user_id": record.user_id,
                "original_audio_name": record.original_audio_name,
                "audio_path": record.audio_path,
                "title": record.title,
                "date": record.date,
                "tags": tags,
                "created_at": record.created_at,
            }
            result.append(audio_data)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500







# ------------------------------------------------------------
# 	Routes for authentication 
# ------------------------------------------------------------

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    # Query the database for the user
    user = User.query.filter_by(email=email).first()

    # Check if the user exists and the password is correct
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid email or password"}), 401

    # Generate the JWT access token
    access_token = create_access_token(
        identity=str(user.id),  # Usar el ID como cadena para `identity`
        additional_claims={"email": user.email}  # Información adicional en los claims
    )
    return jsonify(access_token=access_token, user={"id": user.id, "email": user.email, "username": user.username}), 200



# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200




# route ends here   ----------------------




@bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()

    # Validar datos de entrada
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400

    # Buscar al usuario en la base de datos
    user = User.query.filter_by(email=data['email']).first()

    # Verificar contraseña
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401

    # Iniciar sesión
    login_user(user)

    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200


    
@app.route('/signout')
@login_required
def signout():
    logout_user()  # Cerrar la sesión del usuario
    flash('You have been logged out.', 'info')
    return redirect(url_for('signin'))  # Redirige a la página de inicio de sesión


@bp.route('/users/<int:user_id>/audio-records', methods=['GET'])
def user_audio_records(user_id):
    """Listar los archivos de audio subidos por un usuario específico"""
    try:
        user = User.query.get_or_404(user_id)
        records = AudioRecordV.query.filter_by(user_id=user_id).all()
        return render_template("user_audio_records.html", user=user, records=records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_audio():
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401

    audio = request.files.get('audio')
    if not audio:
        return jsonify({"error": "No audio file provided"}), 400

    # Guardar archivo y crear el registro
    file_path = save_to_s3(audio)  # Función ficticia para guardar el archivo en S3
    new_audio = AudioRecord(
        user_id=current_user.id,
        original_audio_name=audio.filename,
        audio_path=file_path,
        date=request.form.get('date'),
        time=request.form.get('time'),
        location=request.form.get('location'),
        conditions=request.form.get('conditions'),
        temperature=request.form.get('temperature'),
        wind_speed=request.form.get('wind_speed'),
        wind_direction=request.form.get('wind_direction'),
        recordist=request.form.get('recordist'),
        notes=request.form.get('notes'),
        tags=request.form.get('tags'),
    )
    db.session.add(new_audio)
    db.session.commit()
    return jsonify({"message": "File uploaded successfully!"}), 201

@bp.route('/google-login', methods=['POST'])
def google_login():
    data = request.json
    email = data.get('email')
    name = data.get('name')

    if not email or not name:
        return jsonify({"error": "Missing required fields"}), 400

    # Verificar si el usuario ya existe
    user = User.query.filter_by(email=email).first()
    if not user:
        # Crear nuevo usuario
        user = User(username=name, email=email)
        db.session.add(user)
        db.session.commit()

    # Generar un token de sesión
    access_token = create_access_token(identity=user.id)

    return jsonify({"user": {"id": user.id, "username": user.username, "email": user.email}, "token": access_token}), 200

