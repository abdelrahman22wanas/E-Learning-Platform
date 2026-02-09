from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from lessons.models import Lesson
from .models import CourseProgress, LessonCompletion
from .serializers import CourseProgressSerializer


class CourseProgressViewSet(viewsets.ReadOnlyModelViewSet):
	serializer_class = CourseProgressSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return CourseProgress.objects.select_related(
			"course", "last_accessed_lesson"
		).filter(student=self.request.user)


class ProgressUpdateView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		lesson_id = request.data.get("lesson_id")
		if not lesson_id:
			return Response(
				{"detail": "lesson_id is required."}, status=status.HTTP_400_BAD_REQUEST
			)

		lesson = get_object_or_404(Lesson.objects.select_related("course"), pk=lesson_id)
		completion, _ = LessonCompletion.objects.get_or_create(
			student=request.user, lesson=lesson
		)

		progress, _ = CourseProgress.objects.get_or_create(
			student=request.user, course=lesson.course
		)
		progress.last_accessed_lesson = lesson
		progress.update_progress()
		progress.save(update_fields=["last_accessed_lesson", "updated_at"])

		return Response(
			{
				"lesson_completion_id": completion.id,
				"course_progress_id": progress.id,
				"progress_percent": progress.progress_percent,
			}
		)
