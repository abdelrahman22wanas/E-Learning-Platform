from django.contrib import admin

from .models import CourseProgress, LessonCompletion


@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
	list_display = ("student", "course", "progress_percent", "updated_at")


@admin.register(LessonCompletion)
class LessonCompletionAdmin(admin.ModelAdmin):
	list_display = ("student", "lesson", "completed_at")
