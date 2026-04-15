from rest_framework import serializers

from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.username", read_only=True)
    lesson_count = serializers.IntegerField(read_only=True)
    level_label = serializers.SerializerMethodField()
    estimated_duration = serializers.SerializerMethodField()

    def get_level_label(self, obj):
        lesson_count = getattr(obj, "lesson_count", obj.lessons.count())
        if lesson_count <= 2:
            return "Beginner"
        if lesson_count <= 4:
            return "Intermediate"
        return "Advanced"

    def get_estimated_duration(self, obj):
        lesson_count = getattr(obj, "lesson_count", obj.lessons.count())
        return f"{max(lesson_count * 15, 30)} min"

    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "description",
            "category",
            "image_url",
            "instructor",
            "instructor_name",
            "lesson_count",
            "level_label",
            "estimated_duration",
            "created_at",
            "updated_at",
        )
