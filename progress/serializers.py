from rest_framework import serializers

from .models import CourseProgress, LessonCompletion


class LessonCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonCompletion
        fields = ("id", "student", "lesson", "completed_at")
        read_only_fields = ("student", "completed_at")


class CourseProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = CourseProgress
        fields = (
            "id",
            "student",
            "course",
            "course_title",
            "last_accessed_lesson",
            "progress_percent",
            "updated_at",
        )
        read_only_fields = ("student", "progress_percent", "updated_at")
