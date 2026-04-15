import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourse, getLessons } from '../api';
import EmptyState from '../components/EmptyState';

function useCourseData(courseId) {
  const [state, setState] = React.useState({ loading: true, course: null, lessons: [], error: null });

  React.useEffect(() => {
    let active = true;
    Promise.all([getCourse(courseId), getLessons(courseId)])
      .then(([course, lessons]) => {
        if (active) setState({ loading: false, course, lessons, error: null });
      })
      .catch((error) => {
        if (active) setState({ loading: false, course: null, lessons: [], error });
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  return state;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { loading, course, lessons, error } = useCourseData(courseId);

  if (loading) {
    return <div className="loading-card glass">Loading course...</div>;
  }

  if (error || !course) {
    return <EmptyState title="Course unavailable" message="The selected course could not be loaded right now." />;
  }

  return (
    <div className="page-stack">
      <section className="detail-hero glass">
        <p className="eyebrow">Course details</p>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="course-card__meta">
          <span className="chip">{course.category}</span>
          <span className="chip">{course.lesson_count ?? lessons.length} lessons</span>
          <span className="chip">{course.level_label || 'Beginner'}</span>
        </div>
      </section>

      <section className="panel-stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Lesson roadmap</p>
            <h2>Lessons</h2>
          </div>
        </div>
        <div className="grid-cards">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="lesson-card glass">
              <div className="course-card__top">
                <span className="pill">{lesson.content_type}</span>
                <span className="pill pill-soft">#{lesson.order}</span>
              </div>
              <h3>{lesson.title}</h3>
              <p className="muted">{lesson.course_title}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
