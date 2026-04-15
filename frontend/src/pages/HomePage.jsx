import React from 'react';
import { NavLink } from 'react-router-dom';
import { getCourses } from '../api';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { SectionHeading } from '../components/RouteWrapper';

function useCourses() {
  const [state, setState] = React.useState({ loading: true, data: [], error: null });

  React.useEffect(() => {
    let active = true;
    getCourses()
      .then((courses) => {
        if (active) setState({ loading: false, data: courses, error: null });
      })
      .catch((error) => {
        if (active) setState({ loading: false, data: [], error });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

export default function HomePage() {
  const { loading, data: courses } = useCourses();
  const featured = courses.slice(0, 6);
  const recommended = courses.slice(0, 3);
  const [query, setQuery] = React.useState('');
  const [level, setLevel] = React.useState('all');

  const filtered = React.useMemo(() => {
    return courses.filter((course) => {
      const levelLabel = course.level_label || 'Beginner';
      const matchesLevel = level === 'all' || levelLabel === level;
      const haystack = `${course.title} ${course.category} ${course.description}`.toLowerCase();
      return matchesLevel && haystack.includes(query.toLowerCase());
    });
  }, [courses, level, query]);

  return (
    <div className="page-stack">
      <section className="hero-panel glass">
        <div className="hero-copy">
          <p className="eyebrow">Practical online learning</p>
          <h1>Stylish React UI with motion, depth, and better structure.</h1>
          <p>
            The Django backend stays in place, while the frontend now feels premium with gradients,
            shadows, animated hover states, and a real component system.
          </p>
          <div className="hero-actions">
            <NavLink className="button" to="/courses">Explore courses</NavLink>
            <NavLink className="button button-ghost" to="/dashboard/student">Continue learning</NavLink>
          </div>
        </div>
        <div className="hero-stats">
          <StatCard label="React app" value="Modern" hint="Built as a proper Vite frontend" />
          <StatCard label="Motion" value="Smooth" hint="Hover lifts, reveals, and glow" />
          <StatCard label="Design" value="Premium" hint="Colored buttons and layered shadows" />
        </div>
      </section>

      <section className="panel-stack">
        <SectionHeading eyebrow="Recommended" title="Start here" />
        {loading ? (
          <div className="loading-card glass">Loading courses...</div>
        ) : recommended.length ? (
          <div className="grid-cards">
            {recommended.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <EmptyState title="No recommendations" message="Seed some courses to populate the homepage." />
        )}
      </section>

      <section className="panel-stack">
        <SectionHeading eyebrow="Interactive" title="React course explorer" />
        <div className="explorer glass">
          <div className="explorer-toolbar">
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search course titles, categories, or skills"
            />
            <div className="chip-group">
              {['all', 'Beginner', 'Intermediate', 'Advanced'].map((item) => (
                <button
                  key={item}
                  className={`filter-chip ${level === item ? 'active' : ''}`}
                  onClick={() => setLevel(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="grid-cards">
            {filtered.length ? filtered.map((course) => <CourseCard key={course.id} course={course} />) : (
              <EmptyState title="No matches" message="Try another keyword or switch the level filter." />
            )}
          </div>
        </div>
      </section>

      <section className="panel-stack">
        <SectionHeading eyebrow="Why it feels better" title="Frontend improvements" />
        <div className="grid-three">
          <article className="info-card glass"><h3>Sharper hierarchy</h3><p>Clear sections and large type make the UI easier to scan.</p></article>
          <article className="info-card glass"><h3>Color and depth</h3><p>Buttons, chips, and cards use layered gradients and shadows.</p></article>
          <article className="info-card glass"><h3>Built for scale</h3><p>Reusable components keep the UI structured and easy to grow.</p></article>
        </div>
      </section>

      <section className="panel-stack">
        <SectionHeading eyebrow="Featured" title="Top courses" />
        <div className="grid-cards">
          {featured.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>
    </div>
  );
}
