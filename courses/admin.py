from django.contrib import admin

from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
	list_display = ("title", "category", "instructor", "created_at")
	search_fields = ("title", "category")
