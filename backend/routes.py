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



@bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    })

@bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
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
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

# ----------------------                AUDIOS                  ----------------------

# ----------------------    UPLOAD, EDIT OR ELIMINATE AUDIOS    ----------------------


@bp.route('/upload-files', methods=['POST'])
@jwt_required()  # Verificar que el token es válido
def upload_file():
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
    """Eliminar archivo del bucket de S3"""
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
    """Generar una URL temporal para descargar/visualizar el archivo desde S3"""
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
    """Guardar información del registro de audio"""
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
    """Eliminar un registro de audio y el archivo asociado en S3"""
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
    """Listar todos los registros de audio"""
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

@bp.route('/list-audio-records/<int:id>', methods=['GET'])
def get_audio_record(id):
    """Obtener detalles de un archivo de audio por ID"""
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

