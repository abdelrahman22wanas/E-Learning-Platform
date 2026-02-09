from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class UserViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = User.objects.all().order_by("username")
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]


class RegisterView(generics.CreateAPIView):
	serializer_class = RegisterSerializer
	permission_classes = [permissions.AllowAny]
