import React from 'react';
import { NavLink } from 'react-router-dom';
import { getCourses } from '../api';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { SectionHeading } from '../components/RouteWrapper';

export default function StudentDashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    getCourses()
      .then((items) => {
        if (active) {
          setCourses(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <SectionHeading eyebrow="Dashboard" title="Student dashboard" />
      <p className="muted">Track your progress and jump back into learning with a cleaner layout.</p>

      <div className="grid-stats">
        <StatCard label="Courses" value={courses.length} hint="Available in the catalog" />
        <StatCard label="Resume" value="Quick" hint="One click back into learning" />
        <StatCard label="Motion" value="Smooth" hint="Styled cards and focus states" />
      </div>

      <section className="resume-panel glass">
        <p className="eyebrow">Continue learning</p>
        <h2>Resume your next lesson</h2>
        <p>Use this page as your springboard back into enrolled courses and progress tracking.</p>
        <NavLink className="button" to="/courses">Resume course</NavLink>
      </section>

      <section className="panel-stack">
        <SectionHeading eyebrow="Explore" title="Your learning paths" />
        {loading ? (
          <div className="loading-card glass">Loading dashboard...</div>
        ) : courses.length ? (
          <div className="grid-cards">
            {courses.slice(0, 4).map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <EmptyState title="No enrollments yet" message="Enroll in courses to see your dashboard populate." />
        )}
      </section>
    </div>
  );
}
