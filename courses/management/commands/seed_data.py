from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from courses.models import Course
from lessons.models import Lesson


class Command(BaseCommand):
    help = "Seed sample users, courses, and lessons."

    def handle(self, *args, **options):
        User = get_user_model()

        instructor, _ = User.objects.get_or_create(
            username="instructor",
            defaults={
                "email": "instructor@example.com",
                "role": User.Role.INSTRUCTOR,
            },
        )
        instructor.set_password("InstructorPass123")
        instructor.save(update_fields=["password"])

        student, _ = User.objects.get_or_create(
            username="student",
            defaults={
                "email": "student@example.com",
                "role": User.Role.STUDENT,
            },
        )
        student.set_password("StudentPass123")
        student.save(update_fields=["password"])

        course, _ = Course.objects.get_or_create(
            title="Intro to Learning Design",
            defaults={
                "description": "Build engaging learning paths with practical templates.",
                "category": "Instructional Design",
                "instructor": instructor,
            },
        )

        Lesson.objects.get_or_create(
            course=course,
            order=1,
            defaults={
                "title": "Welcome and Objectives",
                "content_type": Lesson.ContentType.TEXT,
                "text_content": "Welcome to the course! Here is what you will learn.",
            },
        )
        Lesson.objects.get_or_create(
            course=course,
            order=2,
            defaults={
                "title": "Storyboard Your Module",
                "content_type": Lesson.ContentType.TEXT,
                "text_content": "Map out the flow of your learning module in minutes.",
            },
        )

        self.stdout.write(self.style.SUCCESS("Seed data created."))
