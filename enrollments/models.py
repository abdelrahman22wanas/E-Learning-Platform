from django.conf import settings
from django.db import models

from courses.models import Course


class Enrollment(models.Model):
	student = models.ForeignKey(
		settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments"
	)
	course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
	enrolled_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ("student", "course")

	def __str__(self):
		return f"{self.student.username} enrolled in {self.course.title}"
