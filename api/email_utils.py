# api/email_utils.py

import os
import requests

MAILERSEND_API_URL = "https://api.mailersend.com/v1/email"
FROM_EMAIL = os.getenv("MAILERSEND_FROM_EMAIL", "infos@wirkconsulting.com")
FROM_NAME = os.getenv("MAILERSEND_FROM_NAME", "RC Klean")

def send_mailersend_email(to_email, subject, text, html=None):
    headers = {
        "Authorization": f"Bearer {os.getenv('MAILERSEND_API_TOKEN')}",
        "Content-Type": "application/json",
    }

    payload = {
        "from": {"email": FROM_EMAIL, "name": FROM_NAME},
        "to": [{"email": to_email}],
        "subject": subject,
        "text": text,
    }

    if html:
        payload["html"] = html

    try:
        response = requests.post(MAILERSEND_API_URL, json=payload, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"[MailerSend] Error sending email to {to_email}: {e}")
