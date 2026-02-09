from rest_framework import permissions, viewsets

from .models import Course
from .permissions import IsInstructorOrReadOnly
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
	queryset = Course.objects.select_related("instructor").all().order_by("-created_at")
	serializer_class = CourseSerializer
	permission_classes = [IsInstructorOrReadOnly]

	def perform_create(self, serializer):
		serializer.save(instructor=self.request.user)
