window.onload = function() {
    showHeader();
    showMovies();
};

function showHeader() {
    $.getJSON("./json/statistic.json", function(data0) {
        var html = "<h1>" + 'SCUT theater' + "</h1>" + "<h2>" + "正在热映：" + data0.onShowMovieNum + "</h2>";
        $(".header").append(html);
    });
}

function showMovies() {
    $.getJSON("./json/movies.json", function(data) { //路径相对于使用此函数的文件，即，index.html
        var half = data.length / 2 - 1;
        var html = '';
        $.each(data, function(i, item) {
            html = '';
            var id = item.movieID;
            var url = "sessions.html?filmid=" + id;
            html +=
                "<li>" +
                "<a href=" + url + ">" +
                "<figure>" +
                "<img class='poster' src='./img/" + id + "1.jpg" + "'>" +
                "<figmask>" +
                "<h3 class='fname'>" + item.name + "</h3>" +
                "</figmask>" +
                "</figure>" +
                "</a>" +
                "</li>";
            $(".searchResult").append(html);
        });
    });
}