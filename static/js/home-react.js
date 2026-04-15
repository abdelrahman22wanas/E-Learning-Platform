(function () {
    var rootElement = document.getElementById('course-explorer-root');
    var dataNode = document.getElementById('spotlight-courses-data');

    if (!rootElement || !dataNode || typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        return;
    }

    var courses = [];
    try {
        courses = JSON.parse(dataNode.textContent || '[]');
    } catch (error) {
        courses = [];
    }

    var e = React.createElement;

    function CourseExplorer() {
        var levelState = React.useState('all');
        var activeLevel = levelState[0];
        var setActiveLevel = levelState[1];

        var queryState = React.useState('');
        var query = queryState[0];
        var setQuery = queryState[1];

        var levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
        var filtered = courses.filter(function (course) {
            var matchesLevel = activeLevel === 'all' || course.level_label === activeLevel;
            var haystack = [course.title, course.category, course.description].join(' ').toLowerCase();
            var matchesQuery = haystack.indexOf(query.toLowerCase()) !== -1;
            return matchesLevel && matchesQuery;
        });

        return e(
            React.Fragment,
            null,
            e(
                'div',
                { className: 'react-toolbar' },
                e('input', {
                    className: 'react-search',
                    type: 'search',
                    placeholder: 'Search courses, categories, or skills...',
                    value: query,
                    onChange: function (event) {
                        setQuery(event.target.value);
                    },
                }),
                e(
                    'div',
                    { className: 'react-filters' },
                    levels.map(function (level) {
                        return e(
                            'button',
                            {
                                key: level,
                                type: 'button',
                                className: 'react-chip' + (activeLevel === level ? ' is-active' : ''),
                                onClick: function () {
                                    setActiveLevel(level);
                                },
                            },
                            level
                        );
                    })
                )
            ),
            filtered.length
                ? e(
                      'div',
                      { className: 'react-grid' },
                      filtered.map(function (course) {
                          return e(
                              'article',
                              { className: 'card react-card', key: course.id },
                              e('div', { className: 'card-topline' }, e('p', { className: 'muted' }, course.category), e('span', { className: 'pill' }, course.lesson_count + ' lessons')),
                              e('h3', null, course.title),
                              e('p', null, course.description),
                              e(
                                  'div',
                                  { className: 'react-card__meta' },
                                  e('span', { className: 'pill' }, course.level_label),
                                  e('span', { className: 'pill' }, course.estimated_duration),
                                  course.completion_percent !== null && course.completion_percent !== undefined
                                      ? e('span', { className: 'pill' }, Math.round(course.completion_percent) + '% complete')
                                      : null
                              ),
                              e(
                                  'a',
                                  { className: 'button button--ghost', href: '/courses/' + course.id + '/' },
                                  'Open course'
                              )
                          );
                      })
                  )
                : e(
                      'div',
                      { className: 'react-empty' },
                      e('h3', null, 'No matching courses'),
                      e('p', { className: 'muted' }, 'Try a different keyword or reset the level filter.')
                  )
        );
    }

    var root = ReactDOM.createRoot ? ReactDOM.createRoot(rootElement) : null;
    if (root) {
        root.render(e(CourseExplorer));
    } else if (ReactDOM.render) {
        ReactDOM.render(e(CourseExplorer), rootElement);
    }
})();
