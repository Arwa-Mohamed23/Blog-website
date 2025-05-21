from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
import os

class Post(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    
    def __str__(self):
        return self.title

# Signal to delete the image file when the post is deleted
@receiver(pre_delete, sender=Post)
def delete_image_on_post_delete(sender, instance, **kwargs):
    """
    Delete the image file when the post is deleted
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

# Signal to delete the old image file when the post is updated with a new image
@receiver(pre_save, sender=Post)
def delete_old_image_on_update(sender, instance, **kwargs):
    """
    Delete the old image file when updating with a new image
    """
    if not instance.pk: 
        return
    
    try:
        old_instance = Post.objects.get(pk=instance.pk)
        if old_instance.image and old_instance.image != instance.image:
            if os.path.isfile(old_instance.image.path):
                os.remove(old_instance.image.path)
    except Post.DoesNotExist:
        return  