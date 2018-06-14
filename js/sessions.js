filmID = window.location.href.split("?filmid=")[1] || "1";
window.onload = function() {
    showBanner();
};

function showBanner() {
    var html = '';
    $.getJSON("./json/movies.json", function(data) {
        $.each(data, function(i, item) {
            if (i + '' == filmID - 1) {
                html = '';
                html += "<div class='wrap'>" +
                    "<div class='leftinfo'>" +
                    "<div class='posterBase'>" +
                    "<img class='poster' src='img/" + filmID + 1 + ".jpg'>" +
                    "</div>" +
                    "</div>" +
                    "<div class='rightinfo'>" +
                    "<div class='filminfo'>" +
                    "<h3>" + item.name + "</h3>" +
                    "<h4>" + item.nameEn + "</h4>" +
                    "<div class='infopara'>" +
                    "<p>" + item.type + "</p>" +
                    "<p>" + item.length + " 分钟" + "</p>" +
                    "<p>" + item.director + " 执导" + "</p>" +
                    "<p>" + item.actors + " 主演" + "</p>" +
                    "</div>" +
                    "<div class='infopara'>" +
                    "<p>" + "简介：" + item.description + "</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                $(".banner").append(html);
                var price = item.ticketPrice;
                showSessionList(price);
            }
        });
    });
}

function showSessionList(ticketPrice) {
    var html = '';
    var counter = 0;
    $.getJSON("./json/sessions.json", function(sessions) {
        $.each(sessions, function(i, item) {
            if (filmID == item.movieID) {
                html = '';
                var date = item.startDate.split('2015/')[1];
                var month = date.split('/')[0];
                var day = date.split('/')[1];
                var start = item.startTime;
                var end = item.endTime;
                var hall = item.hallID;
                var id = item.sessionID;
                if ((counter++) % 2 == 0) { html += "<tr>"; } else { html += "<tr class='even'>"; }
                html +=
                    "<td>" +
                    "<span class='other-time'>" + month + "月" + day + "日</span>" +
                    "<br>" +
                    "<span class='begin-time'>" + start + "</span>" +
                    "<br>" +
                    "<span class='other-time'>" + end + "散场</span>" +
                    "</td>" +
                    "<td>" +
                    "<span class='lang'>国语2D</span>" +
                    "</td>" +
                    "<td>" +
                    "<span class='hall'>" + hall + "号厅</span>" +
                    "</td>" +
                    "<td>" +
                    "<span class='sell-price'>" + ticketPrice + "</span>" +
                    "</td>" +
                    "<td>" +
                    "<a class='buy-btn normal' " +
                    "href='seats.html?sessionID=" + id + "' " +
                    //"data-act='show-click' " +
                    // "data-val='{movie_id: 1207042, cinema_id:2161}' " +
                    // "data-bid='b_gvh3l8gg' " +
                    "data-tip=''>选座购票</a>" +
                    "</td>" +
                    "</tr>";
                $(".tbody").append(html);
            }
        });
    });
}