from rest_framework import permissions, viewsets

from .models import Enrollment
from .serializers import EnrollmentSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
	serializer_class = EnrollmentSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Enrollment.objects.select_related("course", "student").filter(
			student=self.request.user
		)

	def perform_create(self, serializer):
		serializer.save(student=self.request.user)
