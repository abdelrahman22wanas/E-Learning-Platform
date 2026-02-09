from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
	fieldsets = UserAdmin.fieldsets + (
		("Profile", {"fields": ("role", "bio", "avatar_url")}),
	)
	list_display = ("username", "email", "role", "is_staff")
