import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const lessonCount = course.lesson_count ?? 0;
  const levelLabel = course.level_label || (lessonCount <= 2 ? 'Beginner' : lessonCount <= 4 ? 'Intermediate' : 'Advanced');

  return (
    <article className="course-card glass">
      <div className="course-card__top">
        <span className="pill">{course.category}</span>
        <span className="pill pill-soft">{lessonCount} lessons</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-card__meta">
        <span className="chip">{levelLabel}</span>
        <span className="chip">{course.estimated_duration || '30 min'}</span>
      </div>
      <Link className="button button-secondary" to={`/courses/${course.id}`}>
        View course
      </Link>
    </article>
  );
}
