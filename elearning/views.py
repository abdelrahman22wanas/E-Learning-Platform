from django.contrib.auth.decorators import login_required
from django.db import DatabaseError
from django.shortcuts import get_object_or_404, render

from courses.models import Course
from enrollments.models import Enrollment
from lessons.models import Lesson
from progress.models import CourseProgress
from users.models import User


def _course_level(lesson_count):
    if lesson_count <= 2:
        return "Beginner"
    if lesson_count <= 4:
        return "Intermediate"
    return "Advanced"


def _attach_course_metadata(courses, user=None):
    courses = list(courses)
    progress_by_course = {}

    if user and user.is_authenticated and courses:
        progress_by_course = dict(
            CourseProgress.objects.filter(student=user, course__in=courses).values_list(
                "course_id", "progress_percent"
            )
        )

    for course in courses:
        lesson_count = course.lessons.count()
        course.lesson_count = lesson_count
        course.level_label = _course_level(lesson_count)
        course.estimated_duration = f"{max(lesson_count * 15, 30)} min"
        completion = progress_by_course.get(course.id)
        course.completion_percent = float(completion) if completion is not None else None

    return courses


def home(request):
    try:
        featured_courses = _attach_course_metadata(
            Course.objects.select_related("instructor").order_by("-created_at")[:6],
            request.user,
        )

        if request.user.is_authenticated:
            enrolled_ids = Enrollment.objects.filter(student=request.user).values_list(
                "course_id", flat=True
            )
            recommended_courses = _attach_course_metadata(
                Course.objects.select_related("instructor")
                .exclude(id__in=enrolled_ids)
                .order_by("-created_at")[:3],
                request.user,
            )
            recommendations_title = "Recommended for you"
        else:
            recommended_courses = featured_courses[:3]
            recommendations_title = "Start with these courses"
    except DatabaseError:
        featured_courses = []
        recommended_courses = []
        recommendations_title = "Start with these courses"
    return render(
        request,
        "home.html",
        {
            "featured_courses": featured_courses,
            "recommended_courses": recommended_courses,
            "recommendations_title": recommendations_title,
        },
    )


def course_list(request):
    query = request.GET.get("q", "").strip()
    category = request.GET.get("category", "").strip()
    sort = request.GET.get("sort", "newest").strip()
    try:
        courses = Course.objects.select_related("instructor")

        if query:
            courses = courses.filter(title__icontains=query)
        if category:
            courses = courses.filter(category__iexact=category)

        sort_map = {
            "newest": "-created_at",
            "oldest": "created_at",
            "title": "title",
            "title_desc": "-title",
        }
        courses = _attach_course_metadata(
            courses.order_by(sort_map.get(sort, "-created_at")),
            request.user,
        )

        categories = (
            Course.objects.values_list("category", flat=True)
            .distinct()
            .order_by("category")
        )
    except DatabaseError:
        courses = []
        categories = []
        sort = "newest"
    return render(
        request,
        "courses/course_list.html",
        {
            "courses": courses,
            "query": query,
            "category": category,
            "sort": sort,
            "categories": categories,
        },
    )


def course_detail(request, course_id):
    try:
        course = get_object_or_404(Course.objects.select_related("instructor"), pk=course_id)
        lessons = Lesson.objects.filter(course=course).order_by("order")
        enrollment = None
        progress = None

        if request.user.is_authenticated:
            enrollment = Enrollment.objects.filter(course=course, student=request.user).first()
            progress = CourseProgress.objects.filter(course=course, student=request.user).first()
    except DatabaseError:
        course = None
        lessons = []
        enrollment = None
        progress = None

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
    try:
        lesson = get_object_or_404(Lesson.objects.select_related("course"), pk=lesson_id)
    except DatabaseError:
        lesson = None
    return render(request, "lessons/lesson_detail.html", {"lesson": lesson})


@login_required
def student_dashboard(request):
    try:
        enrollments = (
            Enrollment.objects.filter(student=request.user)
            .select_related("course")
            .order_by("-enrolled_at")
        )
        progress_entries = CourseProgress.objects.filter(student=request.user).select_related(
            "course", "last_accessed_lesson"
        )

        continue_progress = (
            progress_entries.filter(progress_percent__gt=0, progress_percent__lt=100)
            .order_by("-updated_at")
            .first()
        )
        if continue_progress is None:
            continue_progress = progress_entries.order_by("-updated_at").first()
    except DatabaseError:
        enrollments = []
        progress_entries = []
        continue_progress = None

    continue_url = None
    if continue_progress:
        if continue_progress.last_accessed_lesson_id:
            continue_url = f"/lessons/{continue_progress.last_accessed_lesson_id}/"
        else:
            continue_url = f"/courses/{continue_progress.course_id}/"

    return render(
        request,
        "dashboards/student_dashboard.html",
        {
            "enrollments": enrollments,
            "progress_entries": progress_entries,
            "continue_progress": continue_progress,
            "continue_url": continue_url,
        },
    )


@login_required
def instructor_dashboard(request):
    if request.user.role != User.Role.INSTRUCTOR and request.user.role != User.Role.ADMIN:
        return render(request, "dashboards/instructor_dashboard.html", {"courses": []})

    try:
        courses = _attach_course_metadata(
            Course.objects.filter(instructor=request.user).order_by("-created_at"),
            request.user,
        )
        enrollments = Enrollment.objects.filter(course__in=courses).count()
    except DatabaseError:
        courses = []
        enrollments = 0

    return render(
        request,
        "dashboards/instructor_dashboard.html",
        {"courses": courses, "enrollment_count": enrollments},
    )
