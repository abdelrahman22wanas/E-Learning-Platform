from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	class Role(models.TextChoices):
		STUDENT = "student", "Student"
		INSTRUCTOR = "instructor", "Instructor"
		ADMIN = "admin", "Admin"

	role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
	bio = models.TextField(blank=True)
	avatar_url = models.URLField(blank=True)

	def __str__(self):
		return f"{self.username} ({self.get_role_display()})"
