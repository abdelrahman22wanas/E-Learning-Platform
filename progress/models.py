from decimal import Decimal

from django.conf import settings
from django.db import models

from courses.models import Course
from lessons.models import Lesson


class CourseProgress(models.Model):
	student = models.ForeignKey(
		settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="course_progress"
	)
	course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="progress")
	last_accessed_lesson = models.ForeignKey(
		Lesson,
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name="last_accessed_by",
	)
	progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ("student", "course")

	def update_progress(self):
		total = self.course.lessons.count()
		completed = LessonCompletion.objects.filter(
			student=self.student, lesson__course=self.course
		).count()
		if total == 0:
			self.progress_percent = Decimal("0.00")
		else:
			percent = (Decimal(completed) / Decimal(total)) * Decimal("100")
			self.progress_percent = percent.quantize(Decimal("0.01"))
		self.save(update_fields=["progress_percent", "updated_at"])

	def __str__(self):
		return f"{self.student.username} - {self.course.title}"


class LessonCompletion(models.Model):
	student = models.ForeignKey(
		settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_completions"
	)
	lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="completions")
	completed_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ("student", "lesson")

	def __str__(self):
		return f"{self.student.username} completed {self.lesson.title}"
