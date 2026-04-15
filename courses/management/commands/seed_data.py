from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from courses.models import Course
from enrollments.models import Enrollment
from lessons.models import Lesson
from progress.models import CourseProgress


class Command(BaseCommand):
    help = "Seed sample users, courses, lessons, enrollments, and progress."

    def _create_or_update_user(self, User, username, email, role, password, is_superuser=False):
        defaults = {
            "email": email,
            "role": role,
            "is_staff": is_superuser,
            "is_superuser": is_superuser,
        }
        user, _ = User.objects.get_or_create(username=username, defaults=defaults)

        changed_fields = []
        for field_name, field_value in defaults.items():
            if getattr(user, field_name) != field_value:
                setattr(user, field_name, field_value)
                changed_fields.append(field_name)

        user.set_password(password)
        changed_fields.append("password")
        user.save(update_fields=changed_fields)
        return user

    def _seed_course_with_lessons(self, instructor, course_data):
        course, _ = Course.objects.get_or_create(
            title=course_data["title"],
            defaults={
                "description": course_data["description"],
                "category": course_data["category"],
                "instructor": instructor,
            },
        )

        if course.instructor_id != instructor.id:
            course.instructor = instructor
            course.save(update_fields=["instructor", "updated_at"])

        for lesson_data in course_data["lessons"]:
            Lesson.objects.get_or_create(
                course=course,
                order=lesson_data["order"],
                defaults={
                    "title": lesson_data["title"],
                    "content_type": lesson_data["content_type"],
                    "text_content": lesson_data.get("text_content", ""),
                    "video_url": lesson_data.get("video_url", ""),
                    "pdf_url": lesson_data.get("pdf_url", ""),
                },
            )

        return course

    def handle(self, *args, **options):
        User = get_user_model()
        admin = self._create_or_update_user(
            User=User,
            username="admin",
            email="admin@example.com",
            role=User.Role.ADMIN,
            password="AdminPass123",
            is_superuser=True,
        )
        instructor = self._create_or_update_user(
            User=User,
            username="instructor",
            email="instructor@example.com",
            role=User.Role.INSTRUCTOR,
            password="InstructorPass123",
        )
        student = self._create_or_update_user(
            User=User,
            username="student",
            email="student@example.com",
            role=User.Role.STUDENT,
            password="StudentPass123",
        )
        student2 = self._create_or_update_user(
            User=User,
            username="student2",
            email="student2@example.com",
            role=User.Role.STUDENT,
            password="StudentPass123",
        )

        courses_data = [
            {
                "title": "Intro to Learning Design",
                "description": "Build engaging learning paths with practical templates.",
                "category": "Instructional Design",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Welcome and Objectives",
                        "content_type": Lesson.ContentType.TEXT,
                        "text_content": "Welcome to the course! Here is what you will learn.",
                    },
                    {
                        "order": 2,
                        "title": "Storyboard Your Module",
                        "content_type": Lesson.ContentType.TEXT,
                        "text_content": "Map out the flow of your learning module in minutes.",
                    },
                ],
            },
            {
                "title": "Python for Beginners",
                "description": "Learn Python fundamentals from variables to functions.",
                "category": "Programming",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Python Basics",
                        "content_type": Lesson.ContentType.TEXT,
                        "text_content": "Install Python and write your first script.",
                    },
                    {
                        "order": 2,
                        "title": "Control Flow",
                        "content_type": Lesson.ContentType.TEXT,
                        "text_content": "Use if statements and loops to control program execution.",
                    },
                ],
            },
            {
                "title": "Django REST API Essentials",
                "description": "Build clean and secure APIs with Django REST Framework.",
                "category": "Web Development",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Serializers and Views",
                        "content_type": Lesson.ContentType.TEXT,
                        "text_content": "Understand serializers, viewsets, and routers.",
                    },
                    {
                        "order": 2,
                        "title": "Authentication with JWT",
                        "content_type": Lesson.ContentType.TEXT,
                        "text_content": "Secure your API using token-based authentication.",
                    },
                ],
            },
        ]

        created_courses = [self._seed_course_with_lessons(instructor, item) for item in courses_data]

        for seeded_course in created_courses:
            Enrollment.objects.get_or_create(student=student, course=seeded_course)
            Enrollment.objects.get_or_create(student=student2, course=seeded_course)

            progress, _ = CourseProgress.objects.get_or_create(
                student=student,
                course=seeded_course,
                defaults={"progress_percent": 0},
            )
            progress.update_progress()

        self.stdout.write(self.style.SUCCESS("Seed data created successfully."))
        self.stdout.write("Created accounts:")
        self.stdout.write("- admin / AdminPass123 (superuser)")
        self.stdout.write("- instructor / InstructorPass123")
        self.stdout.write("- student / StudentPass123")
        self.stdout.write("- student2 / StudentPass123")
        self.stdout.write(f"Total courses available: {Course.objects.count()}")
        self.stdout.write(f"Total lessons available: {Lesson.objects.count()}")
