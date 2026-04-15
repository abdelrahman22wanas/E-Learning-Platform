const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export function getCourses() {
  return request('/courses/');
}

export function getCourse(courseId) {
  return request(`/courses/${courseId}/`);
}

export function getLessons(courseId) {
  return request(`/lessons/?course=${courseId}`);
}

export function getCurrentUser() {
  return request('/users/').catch(() => []);
}
