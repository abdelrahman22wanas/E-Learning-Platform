from django.contrib import admin

from .models import Lesson


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
	list_display = ("title", "course", "content_type", "order")
	list_filter = ("content_type",)
	search_fields = ("title",)
