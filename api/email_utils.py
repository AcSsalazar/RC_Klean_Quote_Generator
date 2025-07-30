import requests
from django.conf import settings  # ✅ Usa settings de Django

MAILERSEND_API_URL = "https://api.mailersend.com/v1/email"

def send_mailersend_email(to_email, subject, text, html=None):
    headers = {
        "Authorization": f"Bearer {settings.MAILERSEND_API_TOKEN}",  # ✅ Usa settings
        "Content-Type": "application/json",
    }

    payload = {
        "from": {
            "email": settings.MAILERSEND_FROM_EMAIL,
            "name": settings.MAILERSEND_FROM_NAME
        },
        "to": [{"email": to_email}],
        "subject": subject,
        "text": text,
        "reply_to": [{"email": settings.MAILERSEND_REPLY_TO_EMAIL}],
    }

    if html:
        payload["html"] = html

    try:
        response = requests.post(MAILERSEND_API_URL, json=payload, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"[MailerSend] Error sending email to {to_email}: {e}")
        print("MailerSend API Token from settings: ", settings.MAILERSEND_API_TOKEN)