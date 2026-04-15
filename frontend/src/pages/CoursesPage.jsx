import React from 'react';
import { getCourses } from '../api';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { SectionHeading } from '../components/RouteWrapper';

export default function CoursesPage() {
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [sort, setSort] = React.useState('newest');

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

  const categories = React.useMemo(() => Array.from(new Set(courses.map((course) => course.category))).sort(), [courses]);

  const filtered = React.useMemo(() => {
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
  }, [courses, category, search, sort]);

  return (
    <div className="page-stack">
      <SectionHeading eyebrow="Browse" title="Courses" />
      <div className="explorer glass">
        <div className="explorer-toolbar">
          <input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses" />
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

        {loading ? (
          <div className="loading-card glass">Loading courses...</div>
        ) : filtered.length ? (
          <div className="grid-cards">
            {filtered.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <EmptyState title="No courses found" message="Adjust your search or filters to uncover matching courses." />
        )}
      </div>
    </div>
  );
}
