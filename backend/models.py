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
        
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(100), unique=True, nullable=False)  # Campo SKU único para cada producto
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    category = db.Column(db.String(100), nullable=False)  # Nueva columna para la categoría
    active = db.Column(db.Boolean, default=True)  # Nueva columna para indicar si el producto está activo
    stock_threshold = db.Column(db.Integer, nullable=True)  # Umbral de stock personalizado por producto (opcional)
    
    
    # Relación con CartItem
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    # Relación con OrderItem
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    def __repr__(self):
        return f'<Product {self.name}>'


class ProductImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    url = db.Column(db.String(255), nullable=False)  # URL de la imagen en Cloudinary
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    public_id = db.Column(db.String(255), nullable=True)  # ID público de Cloudinary para eliminar la imagen
    
    # Relación con Product
    product = db.relationship('Product', backref=db.backref('images', lazy=True))

    def __repr__(self):
        return f'<ProductImage {self.url}>'


class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('carts', lazy=True))
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    # Relación con CartItem
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Cart {self.id} User {self.user_id}>'


class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    def __repr__(self):
        return f'<CartItem Cart {self.cart_id} Product {self.product_id}>'
        
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    is_paid = db.Column(db.Boolean, nullable=False, default=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    # Relación con OrderItem
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Order {self.id} User {self.user_id} Paid {self.is_paid}>'
        
class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f'<OrderItem Order {self.order_id} Product {self.product_id}>'

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('addresses', lazy=True))
    address_line = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    contact_phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)

    def __repr__(self):
        return f'<Address {self.address_line}, {self.city}>'


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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Relación con usuarios
    original_audio_name = db.Column(db.String(255), nullable=False)  # Nombre original del archivo
    audio_path = db.Column(db.String(255), nullable=False)  # Ruta del archivo en S3
    image_path = db.Column(db.String(255), nullable=True)  # Ruta de la imagen en S3
    date = db.Column(db.String(10), nullable=True)  # Fecha (YYYY-MM-DD)
    time = db.Column(db.String(8), nullable=True)  # Hora (HH:MM:SS)
    location = db.Column(db.String(100), nullable=True)  # Ubicación (lat, lon)
    conditions = db.Column(db.String(50), nullable=True)  # Condiciones (Clear, Cloudy, etc.)
    temperature = db.Column(Float, nullable=True)  # Temperatura como número decimal
    wind_speed = db.Column(Float, nullable=True)  # Velocidad del viento en km/h
    wind_direction = db.Column(db.String(10), nullable=True)  # Dirección del viento (N, NW, etc.)
    recordist = db.Column(db.String(100), nullable=True)  # Persona que grabó el audio
    notes = db.Column(db.Text, nullable=True)  # Notas descriptivas
    tags = db.Column(JSON, nullable=True)  # Tags como JSON (lista)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de creación

    user = db.relationship('User', backref='user_audio_records', lazy=True)  # Cambiamos 'audio_records' a 'user_audio_records'



