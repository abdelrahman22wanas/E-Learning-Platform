from django.db import models

from courses.models import Course


class Lesson(models.Model):
	class ContentType(models.TextChoices):
		VIDEO = "video", "Video"
		TEXT = "text", "Text"
		PDF = "pdf", "PDF"

	course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
	title = models.CharField(max_length=200)
	content_type = models.CharField(max_length=20, choices=ContentType.choices)
	video_url = models.URLField(blank=True)
	text_content = models.TextField(blank=True)
	pdf_url = models.URLField(blank=True)
	order = models.PositiveIntegerField(default=1)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["order", "id"]

	def __str__(self):
		return f"{self.course.title} - {self.title}"
