"""ajoute last_message_at

Revision ID: f96d077c188d
Revises: acb955b1ee43
Create Date: 2025-06-30 05:49:18.793480

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f96d077c188d'
down_revision: Union[str, Sequence[str], None] = 'acb955b1ee43'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('conversation', sa.Column('last_message_at', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('conversation', 'last_message_at')
    # ### end Alembic commands ###
