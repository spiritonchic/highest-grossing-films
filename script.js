let all_movies = [];
let availableYears = [];
let lastYear = 'Select End Year';
let sortBy = 'title';
let search_query = '';

async function loadMovies() {
    const response = await fetch('films.json');
    all_movies = await response.json();

    availableYears = [...new Set(all_movies.map(movie => movie.release_year))].sort((a, b) => a - b);

    populateYearSelect();
    displayMovies();
}

function populateYearSelect() {
    const startYearSelect = document.getElementById('startYear');
    const endYearSelect = document.getElementById('endYear');

    availableYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        startYearSelect.appendChild(option);
    });
    availableYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        endYearSelect.appendChild(option);
    });

    startYearSelect.addEventListener('change', () => {
        const startYear = parseInt(startYearSelect.value, 10);
        endYearSelect.innerHTML = '<option value="">Select End Year</option>';

        if (!isNaN(startYear)) {
            const filteredYears = availableYears.filter(year => year >= startYear);
            filteredYears.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                endYearSelect.appendChild(option);
            });
        }
        else {
            availableYears.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                endYearSelect.appendChild(option);
            });
        }
        lastYearConverted = parseInt(lastYear, 10);
        if (!isNaN(lastYearConverted)) {
            endYearSelect.value = lastYear;
            if (!isNaN(startYear) && lastYearConverted < startYear) {
                endYearSelect.value = startYear;
                lastYear = startYear;
            }
        }
        displayMovies()
    });

    endYearSelect.addEventListener('change', () => {
        lastYear = endYearSelect.value;
        displayMovies()
    })

    
}

function formatField(field, label) {
    const values = field.split(',').map(value => value.trim());
    const pluralLabel = label === 'Country' ? 'Countries' : label + (values.length > 1 ? 's' : '');
    return `<p><strong>${pluralLabel}:</strong> ${values.join(' • ')}</p>`;
}

function displayMovies() {
    let movies = filterByYear(all_movies);
    movies = filterBySearch(movies);
    movies = sorting(movies);
    const container = document.getElementById('movieList');
    container.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Year:</strong> ${movie.release_year}</p>
            ${formatField(movie.director, 'Director')}
            <p><strong>Box Office:</strong> $${movie.box_office.toLocaleString()}</p>
            ${formatField(movie.country, 'Country')}
        `;
        container.appendChild(card);
    });
}

document.getElementById('search').addEventListener('input', (event) => {
    search_query = event.target.value.toLowerCase();
    displayMovies();
});

document.getElementById('sort').addEventListener('change', (event) => {
    sortBy = event.target.value;
    displayMovies();
});

function filterBySearch(movies) {
    return movies.filter(movie => movie.title.toLowerCase().includes(search_query));
}

function sorting(movies) {
    return [...movies].sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'release_year') return b.release_year - a.release_year;
        if (sortBy === 'box_office') return b.box_office - a.box_office;
    });
}

function filterByYear(movies) {
    const startYear = parseInt(document.getElementById('startYear').value, 10);
    const endYear = parseInt(document.getElementById('endYear').value, 10);
    let filteredMovies = movies;
    if (!isNaN(startYear)) {
        filteredMovies = filteredMovies.filter(movie => movie.release_year >= startYear);
    }
    if (!isNaN(endYear)) {
        filteredMovies = filteredMovies.filter(movie => movie.release_year <= endYear);
    }
    return filteredMovies;
}

loadMovies();