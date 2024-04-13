d3.csv("/static/data/Kaggle_TwitterUSAirlineSentiment.csv", function(error, data) {
    if (error) throw error;

    let sortAscending = true;
    const table = d3.select('#page-wrap').append('table');
    const titles = d3.keys(data[0]);
    const headers = table.append('thead').append('tr').selectAll('th').data(titles).enter().append('th').text(function(d){
                    return d;
                }).on('click', function(d) {
                    headers.attr('class', 'header');

                    if (sortAscending){
                        rows.sort(function(a, b) {
                            //We have to check if the column we click is 'id'. If so we convert the values to integers, as they are
                            //currently strings. If we didn't do this, it would not sort them correctly.
                           return d === 'id' ? d3.ascending(parseInt(a[d]), parseInt(b[d])) : d3.descending(a[d], b[d]);
                        })
                        sortAscending = false
                        this.className = 'des'
                    } else {
                        rows.sort(function(a, b) {
                            return d === 'id' ? d3.descending(parseInt(a[d]), parseInt(b[d])) : d3.ascending(a[d], b[d]);
                        })
                        sortAscending = true
                        this.className = 'aes'
                    }
                });
    const rows = table.append('tbody').selectAll('tr').data(data).enter().append('tr');

    rows.selectAll('td').data(function(d){
        return titles.map(function(k){
            return { 'value': d[k], 'name': k};
        });
    }).enter().append('td').attr('data-th', function(d) {
        return d.name;
    }).text(function(d) {
        return d.value;
    });
});