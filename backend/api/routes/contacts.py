from fastapi import APIRouter, HTTPException
from sqlmodel import select
from starlette.responses import JSONResponse

from backend.api.database.models import Contact, User
from backend.api.database.schemas import ContactResponse, ContactCreate
from backend.api.utils.deps import AsyncSessionDep, CurrUserDep

router = APIRouter()


@router.get("/contact", response_model=list[ContactResponse])
async def list_contacts(session: AsyncSessionDep, current_user: CurrUserDep):
    result = await session.exec(
        select(Contact).where(Contact.user_id == current_user["id"])
    )
    return result.all()


@router.post("/contact", response_model=ContactResponse)
async def create_contact(
        data: ContactCreate,
        session: AsyncSessionDep,
        current_user: CurrUserDep,
):
    contact_user = await session.get(User, data.contact_id)
    if not contact_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = await session.exec(
        select(Contact).where(
            Contact.user_id == current_user["id"], Contact.contact_id == data.contact_id
        )
    )
    if existing.first():
        raise HTTPException(status_code=400, detail="Already added")

    contact = Contact(
        user_id=current_user["id"],
        contact_id=data.contact_id,
        alias_name=data.alias_name if data.alias_name else None,
    )
    session.add(contact)
    await session.commit()
    await session.refresh(contact)
    return contact


@router.delete("/contact/{contact_id}", status_code=204)
async def delete_contact(
        contact_id: int,
        session: AsyncSessionDep,
        current_user: CurrUserDep,
):
    result = await session.exec(
        select(Contact).where(
            Contact.user_id == current_user.id, Contact.contact_id == contact_id
        )
    )
    contact = result.first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    await session.delete(contact)
    await session.commit()
    return JSONResponse({"message": "Contact deleted successfully"}, status_code=204)


@router.get("/contacts/{contact_id}", response_model=ContactResponse)
async def get_contact(
        contact_id: int,
        session: AsyncSessionDep,
        current_user: CurrUserDep,
):
    result = await session.exec(select(Contact).where(Contact.id == contact_id))
    contact = result.first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact
