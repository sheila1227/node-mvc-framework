const actorTemplate = `
<h1>{name}</h1>
<p><em>Born: </em>{contry}, {year}</p>
<ul>{movies}</ul>
`;

exports.build = list => {
    let content = '';
    list.forEach(actor => {
        content += actorTemplate.replace('{name}', actor.name)
                    .replace('{contry}', actor.country)
                    .replace('{year}', actor["birth year"])
                    .replace('{movies}', actor.movies.reduce((moviesHTML, movieName) => {
                        return moviesHTML + `<li>${movieName}</li>`
                    }, ''));
    });
    return content;
};