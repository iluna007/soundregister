"""Initial migration

Revision ID: 338cc636bff3
Revises: 
Create Date: 2025-01-21 13:51:50.643987

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '338cc636bff3'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('audio_record_test',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('audio_path', sa.String(length=255), nullable=False),
    sa.Column('image_path', sa.String(length=255), nullable=True),
    sa.Column('audio_metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.Column('role', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('audio_record',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('audio_path', sa.String(length=255), nullable=False),
    sa.Column('image_path', sa.String(length=255), nullable=True),
    sa.Column('audio_metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('audio_records',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('original_audio_name', sa.String(length=500), nullable=False),
    sa.Column('audio_path', sa.String(length=500), nullable=False),
    sa.Column('title', sa.String(length=500), nullable=False),
    sa.Column('date', sa.String(length=10), nullable=True),
    sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_audio_map',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('audio_id', sa.Integer(), nullable=False),
    sa.Column('assigned_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['audio_id'], ['audio_records.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_audio_map')
    op.drop_table('audio_records')
    op.drop_table('audio_record')
    op.drop_table('user')
    op.drop_table('audio_record_test')
    # ### end Alembic commands ###
