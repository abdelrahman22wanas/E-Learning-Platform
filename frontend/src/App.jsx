import React from 'react';
import { Navigate, NavLink, Route, Routes, useParams } from 'react-router-dom';
import { getCourse, getCourses, getLessons } from './api';

function useAsyncValue(loader, deps = []) {
  const [state, setState] = React.useState({ loading: true, data: null, error: null });

  React.useEffect(() => {
    let alive = true;
    setState({ loading: true, data: null, error: null });
    loader()
      .then((data) => {
        if (alive) setState({ loading: false, data, error: null });
      })
      .catch((error) => {
        if (alive) setState({ loading: false, data: null, error });
      });
    return () => {
      alive = false;
    };
  }, deps);

  return state;
}

function levelFromCount(count) {
  if (count <= 2) return 'Beginner';
  if (count <= 4) return 'Intermediate';
  return 'Advanced';
}

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="app-shell">
      <header className="topbar glass">
        <a className="brand" href="#/">E-Learning</a>
        <button className="icon-button mobile-only" onClick={() => setMenuOpen((value) => !value)}>
          Menu
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/dashboard/student">Student</NavLink>
          <NavLink to="/dashboard/instructor">Instructor</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer glass">
        <div>
          <strong>E-Learning Platform</strong>
          <p>Modern, focused learning with clean UI and fast feedback.</p>
        </div>
        <p className="muted">React + Django API</p>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {action ? action : null}
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <article className="stat-card glass">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {hint ? <p className="muted">{hint}</p> : null}
    </article>
  );
}

function CourseCard({ course }) {
  const lessonCount = course.lesson_count ?? 0;
  return (
    <article className="course-card glass">
      <div className="course-card__top">
        <span className="pill">{course.category}</span>
        <span className="pill pill-soft">{lessonCount} lessons</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-card__meta">
        <span className="chip">{course.level_label || levelFromCount(lessonCount)}</span>
        <span className="chip">{course.estimated_duration || '30 min'}</span>
      </div>
      <NavLink className="button button-secondary" to={`/courses/${course.id}`}>
        View course
      </NavLink>
    </article>
  );
}

function Hero({ onExplore }) {
  return (
    <section className="hero-panel glass">
      <div className="hero-copy">
        <p className="eyebrow">Practical online learning</p>
        <h1>Learn with cinematic visuals, smoother motion, and a cleaner structure.</h1>
        <p>
          This React frontend keeps the Django API, but upgrades the experience with richer cards,
          animated gradients, soft shadows, and focused learning flows.
        </p>
        <div className="hero-actions">
          <button className="button" onClick={onExplore}>Explore courses</button>
          <NavLink className="button button-ghost" to="/dashboard/student">Continue learning</NavLink>
        </div>
      </div>
      <div className="hero-stats">
        <StatCard label="Adaptive layout" value="Responsive" hint="Mobile-first structure" />
        <StatCard label="Visual language" value="Vibrant" hint="Gradient buttons and shadows" />
        <StatCard label="UI motion" value="Smooth" hint="Hover, reveal, and lift effects" />
      </div>
    </section>
  );
}

function CourseExplorer({ courses }) {
  const [query, setQuery] = React.useState('');
  const [activeLevel, setActiveLevel] = React.useState('all');

  const filteredCourses = React.useMemo(() => {
    return courses.filter((course) => {
      const level = course.level_label || levelFromCount(course.lesson_count ?? 0);
      const matchesLevel = activeLevel === 'all' || level === activeLevel;
      const haystack = `${course.title} ${course.category} ${course.description}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesLevel && matchesQuery;
    });
  }, [courses, query, activeLevel]);

  return (
    <section className="panel-stack">
      <SectionHeading eyebrow="Interactive React area" title="Course explorer" />
      <div className="explorer glass">
        <div className="explorer-toolbar">
          <input
            className="input explorer-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses, categories, or learning goals"
          />
          <div className="chip-group">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                type="button"
                className={`filter-chip ${activeLevel === level ? 'active' : ''}`}
                onClick={() => setActiveLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-cards">
          {filteredCourses.length ? filteredCourses.map((course) => <CourseCard key={course.id} course={course} />) : (
            <div className="empty-box">
              <h3>No matches</h3>
              <p className="muted">Try a different search phrase or clear the level filter.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const { loading, data, error } = useAsyncValue(getCourses, []);
  const courses = data || [];
  const featured = courses.slice(0, 6);
  const recommended = courses.slice(0, 3);

  return (
    <div className="page-stack">
      <Hero onExplore={() => document.getElementById('react-explorer')?.scrollIntoView({ behavior: 'smooth' })} />

      <section className="panel-stack">
        <SectionHeading eyebrow="Recommended" title="Start here" />
        {loading ? <div className="loading-card glass">Loading courses...</div> : error ? <div className="loading-card glass">Unable to load courses right now.</div> : (
          <div className="grid-cards">
            {recommended.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>

      <section id="react-explorer" className="panel-stack">
        {loading ? <div className="loading-card glass">Preparing explorer...</div> : <CourseExplorer courses={courses} />}
      </section>

      <section className="panel-stack">
        <SectionHeading eyebrow="Highlights" title="Why this experience feels better" />
        <div className="grid-three">
          <article className="info-card glass"><h3>Intentional motion</h3><p>Cards lift, buttons glow, and sections reveal smoothly.</p></article>
          <article className="info-card glass"><h3>Stronger hierarchy</h3><p>Typography, spacing, and shadows create real depth.</p></article>
          <article className="info-card glass"><h3>Clear flow</h3><p>Home, courses, and dashboards are easier to scan and use.</p></article>
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

function CoursesPage() {
  const { loading, data } = useAsyncValue(getCourses, []);
  const courses = data || [];
  const categories = React.useMemo(() => Array.from(new Set(courses.map((course) => course.category))).sort(), [courses]);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [sort, setSort] = React.useState('newest');

  const filteredCourses = React.useMemo(() => {
    const lower = search.toLowerCase();
    return [...courses]
      .filter((course) => {
        const matchesCategory = category === 'all' || course.category === category;
        const matchesSearch = `${course.title} ${course.category} ${course.description}`.toLowerCase().includes(lower);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === 'title') return a.title.localeCompare(b.title);
        if (sort === 'title_desc') return b.title.localeCompare(a.title);
        if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [courses, search, category, sort]);

  return (
    <div className="page-stack">
      <SectionHeading eyebrow="Browse" title="Courses" />
      <div className="explorer glass">
        <div className="explorer-toolbar">
          <input className="input explorer-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses" />
          <select className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="input" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </div>
        {loading ? <div className="loading-card">Loading courses...</div> : (
          <div className="grid-cards">
            {filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseDetailPage() {
  const { courseId } = useParams();
  const courseState = useAsyncValue(() => getCourse(courseId), [courseId]);
  const lessonsState = useAsyncValue(() => getLessons(courseId), [courseId]);

  if (courseState.loading || lessonsState.loading) {
    return <div className="loading-card glass">Loading course...</div>;
  }

  if (courseState.error) {
    return <div className="loading-card glass">Course not available.</div>;
  }

  const course = courseState.data;
  const lessons = lessonsState.data || [];

  return (
    <div className="page-stack">
      <section className="detail-hero glass">
        <p className="eyebrow">Course details</p>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="course-card__meta">
          <span className="chip">{course.category}</span>
          <span className="chip">{course.lesson_count ?? lessons.length} lessons</span>
          <span className="chip">{course.level_label || levelFromCount(course.lesson_count ?? lessons.length)}</span>
        </div>
      </section>

      <section className="panel-stack">
        <SectionHeading eyebrow="Lesson roadmap" title="Lessons" />
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

function DashboardPage({ title, subtitle, stats, panels }) {
  return (
    <div className="page-stack">
      <SectionHeading eyebrow="Dashboard" title={title} />
      <p className="muted">{subtitle}</p>
      <div className="grid-stats">
        {stats}
      </div>
      <div className="panel-stack">
        {panels}
      </div>
    </div>
  );
}

function StudentDashboardPage() {
  const { loading, data } = useAsyncValue(getCourses, []);
  const courses = data || [];

  return (
    <DashboardPage
      title="Student dashboard"
      subtitle="Track progress, resume learning, and move through structured courses."
      stats={[
        <StatCard key="courses" label="Available courses" value={courses.length} hint="Your learning catalog" />,
        <StatCard key="progress" label="Focus mode" value="Continue" hint="Resume where you stopped" />,
        <StatCard key="support" label="Support" value="Live" hint="Django backend API" />,
      ]}
      panels={[
        <section key="resume" className="resume-panel glass">
          <p className="eyebrow">Quick action</p>
          <h2>Continue learning</h2>
          <p>Jump straight back into the platform with a clean, prominent resume action.</p>
          <NavLink className="button" to="/courses">Resume course</NavLink>
        </section>,
        <section key="cards" className="panel-stack">
          <SectionHeading eyebrow="Explore" title="Your learning paths" />
          {loading ? <div className="loading-card glass">Loading dashboard...</div> : (
            <div className="grid-cards">
              {courses.slice(0, 4).map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </section>,
      ]}
    />
  );
}

function InstructorDashboardPage() {
  const { loading, data } = useAsyncValue(getCourses, []);
  const courses = data || [];

  return (
    <DashboardPage
      title="Instructor dashboard"
      subtitle="Publish courses, review structure, and scan how the catalog looks in a polished UI."
      stats={[
        <StatCard key="teach" label="Your courses" value={courses.length} hint="Published learning paths" />,
        <StatCard key="shadow" label="Visual polish" value="High" hint="Depth, motion, gradients" />,
        <StatCard key="ux" label="Structure" value="Clear" hint="Components and pages" />,
      ]}
      panels={[
        <section key="courses" className="panel-stack">
          <SectionHeading eyebrow="Managed content" title="Courses" />
          {loading ? <div className="loading-card glass">Loading courses...</div> : (
            <div className="grid-cards">
              {courses.slice(0, 6).map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </section>,
      ]}
    />
  );
}

function LoginPage() {
  return (
    <div className="page-stack auth-page">
      <section className="auth-card glass">
        <p className="eyebrow">Sign in</p>
        <h1>Login</h1>
        <p>Wire this to JWT token auth or your preferred provider.</p>
        <div className="auth-grid">
          <input className="input" placeholder="Username" />
          <input className="input" placeholder="Password" type="password" />
          <button className="button button-secondary">Sign in</button>
        </div>
      </section>
    </div>
  );
}

function Shell() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/dashboard/student" element={<StudentDashboardPage />} />
        <Route path="/dashboard/instructor" element={<InstructorDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default Shell;
