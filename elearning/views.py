from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render

from courses.models import Course
from enrollments.models import Enrollment
from lessons.models import Lesson
from progress.models import CourseProgress
from users.models import User


def home(request):
    featured_courses = Course.objects.select_related("instructor").order_by("-created_at")[:6]
    return render(request, "home.html", {"featured_courses": featured_courses})


def course_list(request):
    query = request.GET.get("q", "").strip()
    category = request.GET.get("category", "").strip()
    courses = Course.objects.select_related("instructor")

    if query:
        courses = courses.filter(title__icontains=query)
    if category:
        courses = courses.filter(category__iexact=category)

    categories = Course.objects.values_list("category", flat=True).distinct()
    return render(
        request,
        "courses/course_list.html",
        {
            "courses": courses,
            "query": query,
            "category": category,
            "categories": categories,
        },
    )


def course_detail(request, course_id):
    course = get_object_or_404(Course.objects.select_related("instructor"), pk=course_id)
    lessons = Lesson.objects.filter(course=course).order_by("order")
    enrollment = None
    progress = None

    if request.user.is_authenticated:
        enrollment = Enrollment.objects.filter(course=course, student=request.user).first()
        progress = CourseProgress.objects.filter(course=course, student=request.user).first()

    return render(
        request,
        "courses/course_detail.html",
        {
            "course": course,
            "lessons": lessons,
            "enrollment": enrollment,
            "progress": progress,
        },
    )


def lesson_detail(request, lesson_id):
    lesson = get_object_or_404(Lesson.objects.select_related("course"), pk=lesson_id)
    return render(request, "lessons/lesson_detail.html", {"lesson": lesson})


@login_required
def student_dashboard(request):
    enrollments = (
        Enrollment.objects.filter(student=request.user)
        .select_related("course")
        .order_by("-enrolled_at")
    )
    progress_entries = CourseProgress.objects.filter(student=request.user).select_related(
        "course", "last_accessed_lesson"
    )

    return render(
        request,
        "dashboards/student_dashboard.html",
        {
            "enrollments": enrollments,
            "progress_entries": progress_entries,
        },
    )


@login_required
def instructor_dashboard(request):
    if request.user.role != User.Role.INSTRUCTOR and request.user.role != User.Role.ADMIN:
        return render(request, "dashboards/instructor_dashboard.html", {"courses": []})

    courses = Course.objects.filter(instructor=request.user).order_by("-created_at")
    enrollments = Enrollment.objects.filter(course__in=courses).count()

    return render(
        request,
        "dashboards/instructor_dashboard.html",
        {"courses": courses, "enrollment_count": enrollments},
    )
