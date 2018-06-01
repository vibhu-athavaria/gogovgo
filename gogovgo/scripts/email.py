import sendgrid
from sendgrid.helpers.mail import Email, Content, Mail

from django.conf import settings

sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)


def send_email(send_from, send_to, subject, message):
    """
    Helper method to send emails via sendgrid

    Args:
        send_from: The email address of sender
        send_to: The email address of receiver
        subject: The subject of email
        message: The contents of email

    Returns: Nothin!

    """
    from_email = Email(send_from)
    to_email = Email(send_to)
    content = Content("text/plain", message)
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())
