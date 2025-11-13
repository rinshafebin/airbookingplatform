# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from .tasks import send_user_approval_email

@receiver(post_save, sender=User)
def send_email_on_approval(sender, instance, created, **kwargs):
    
    if instance.approval_status == "approved" and not instance.email_sent:
        send_user_approval_email.delay(instance.email)
        
        User.objects.filter(id=instance.id).update(email_sent=True)
