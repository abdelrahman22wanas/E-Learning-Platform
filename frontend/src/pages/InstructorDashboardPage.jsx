import React from 'react';
import { getCourses } from '../api';
import CourseCard from '../components/CourseCard';
import StatCard from '../components/StatCard';
import { SectionHeading } from '../components/RouteWrapper';

export default function InstructorDashboardPage() {
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
      <SectionHeading eyebrow="Dashboard" title="Instructor dashboard" />
      <p className="muted">A more polished workspace for monitoring the catalog and course presentation.</p>

      <div className="grid-stats">
        <StatCard label="Published courses" value={courses.length} hint="Visible in the catalog" />
        <StatCard label="Shadow depth" value="Rich" hint="Premium visual treatment" />
        <StatCard label="Buttons" value="Colorful" hint="Primary and secondary states" />
      </div>

      <section className="panel-stack">
        <SectionHeading eyebrow="Managed content" title="Courses" />
        {loading ? (
          <div className="loading-card glass">Loading courses...</div>
        ) : (
          <div className="grid-cards">
            {courses.slice(0, 6).map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>
    </div>
  );
}
