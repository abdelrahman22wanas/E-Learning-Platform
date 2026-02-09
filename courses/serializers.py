from rest_framework import serializers

from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.username", read_only=True)

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
            "created_at",
            "updated_at",
        )
