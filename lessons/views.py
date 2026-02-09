from rest_framework import viewsets

from .models import Lesson
from .serializers import LessonSerializer


class LessonViewSet(viewsets.ModelViewSet):
	serializer_class = LessonSerializer

	def get_queryset(self):
		queryset = Lesson.objects.select_related("course")
		course_id = self.request.query_params.get("course")
		if course_id:
			queryset = queryset.filter(course_id=course_id)
		return queryset.order_by("order", "id")
