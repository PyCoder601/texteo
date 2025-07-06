import os
from dotenv import load_dotenv

load_dotenv()


def avatar_url(url):
    print("url", url)
    return f'{os.getenv("BACKEND_URL")}{url}'
