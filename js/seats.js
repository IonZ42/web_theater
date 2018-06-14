sessionid = window.location.href.split("?sessionID=")[1] || "1001";
filmid = sessionid[0];
const limit = 6;
selectedSeats = 0;
validOrder = true;
var Order = {
    "orderDate": "NaN",
    "username": "user",
    "filmID": filmid,
    "hallID": "NaN",
    "seatIDs": [],
    "price": 100,
    "total": 0,
};
window.onload = function() {
    showHall();
};

function showHall() {
    var title = '',
        length = '',
        hall = '',
        version = '',
        time = '',
        price0 = 0,
        price = '';
    $.getJSON("./json/movies.json", function(data) {
        $.each(data, function(i, item) {
            if (item.movieID == filmid) {
                title = "<p class='name text-ellipsis'>" + item.name + "</p>";
                length = "<div class='info-item'>" +
                    "<span>时长 : </span>" +
                    "<span class='value text-ellipsis'>" + item.length + "分钟" + "</span>" +
                    "</div>";
                price0 = item.ticketPrice;
                Order.price = price0;
            }
        });
    });
    $.getJSON("./json/sessions.json", function(data) {
        $.each(data, function(i, item) {
            if (item.sessionID == sessionid) {
                var date = item.startDate.split('2015/')[1];
                var month = date.split('/')[0];
                var day = date.split('/')[1];
                hall = "<div class='info-item'>" +
                    "<span>影厅 : </span>" +
                    "<span class='value text-ellipsis'>" + item.hallID + "号厅</span>" +
                    "</div>";
                Order.hallID = item.hallID;
                version = "<div class='info-item'>" +
                    "<span>版本 : </span>" +
                    "<span class='value text-ellipsis'>国语2D</span>" +
                    "</div>";
                time = "<div class='info-item'>" +
                    "<span>时间 : </span>" +
                    "<span class='value text-ellipsis screen'>" + month + "月" + day + "日 " + item.startTime + "</span>" +
                    "</div>";
                price = "<div class='info-item'>" +
                    "<span>票价 : </span>" +
                    "<span class='value text-ellipsis'>" + price0 + "￥/张</span>" +
                    "</div>";
                $(".show-info").append(title + length + hall + version + time + price);
                showSeats();
            }
        });
    });
}

function showSeats() {
    $.getJSON("./json/sessions.json", function(data) {
        $.each(data, function(j, item) {
            if (item.sessionID == sessionid) {
                var seats = item.seats;
                var html = '';
                var soldSeats = 0;
                for (var i = 0; i < 40; i++) {
                    var row = parseInt(i / 8),
                        column = i % 8;
                    if (column == 0) {
                        html += "<div class='row'>";
                        $(".row-id-container").append("<span class='row-id'>" + (row + 1) + "</span>");
                    }
                    if (seats[i] == false) {
                        html += "<span class='seat selectable' onclick='selectSeat(this)' data-act='seat-click' id='" + i + "' data-st='N' data-row-id='" + row + "' data-column-id='" + column + "'></span>";
                    } else {
                        soldSeats++;
                        html += "<span class='seat sold' onclick='selectSeat(this)' data-act='seat-click' id='" + i + "' data-st='LK' data-row-id='" + row + "' data-column-id='" + column + "'></span>";
                    }
                    if (column == 7) { html += "</div>"; }
                }
                if (soldSeats > 39 || !item.isValid) {
                    validOrder = false;
                    item.isValid = false; //完售不可再买，没写撤销任何订单的代码
                    $("#confirm-btn").addClass("disable");
                    if (confirm("该场次已完售，请退出该页面")) {
                        window.opener = null;
                        window.open('', '_self');
                        window.close();
                    } else {}
                }
                $(".seats-wrapper").append(html);
            }
        });
    });
}

function selectSeat(seat) {
    var sid = seat.id;
    switch (seat.className.split("seat ")[1]) {
        case "selectable":
            if (++selectedSeats > 6) {
                alert("一次最多选6个座位");
                selectedSeats--;
                break;
            }
            $('#' + sid).removeClass("selectable").addClass("selected");
            Order.seatIDs.push(sid);
            addTicket(sid);
            break;
        case "selected":
            for (var i = 0; i < Order.seatIDs.length; i++) {
                if (Order.seatIDs[i] == sid) {
                    Order.seatIDs.splice(i);
                    selectedSeats--;
                    break;
                }
            }
            $('#' + sid).removeClass("selected").addClass("selectable");
            deleteTicket(sid);
            break;
        default:
            {}
    }
}

function addTicket(sid) {
    if (selectedSeats > 0) {
        $("#confirm-btn").removeClass("disable");
        document.getElementsByClassName("no-ticket")[0].style = "display:none";
        document.getElementsByClassName("has-ticket")[0].style = "";
    }
    var index = parseInt(sid);
    var row = parseInt(index / 8) + 1,
        column = index % 8 + 1;
    //应该封装一个函数getRowColumn(seatid:String):{"row":int,"column":int};
    var html = "<span class='ticket' id='st" + sid + "'>" + row + "排" + column + "座</span>";
    $(".ticket-container").append(html);
    Order.total = selectedSeats * Order.price;
    document.getElementsByClassName("price")[0].innerHTML = Order.total;
}

function deleteTicket(sid) {
    var deletedTicket = document.getElementById('st' + sid);
    deletedTicket.parentNode.removeChild(deletedTicket);
    Order.total = selectedSeats * Order.price;
    document.getElementsByClassName("price")[0].innerHTML = Order.total;
    if (selectedSeats < 1) {
        $("#confirm-btn").addClass("disable");
        document.getElementsByClassName("no-ticket")[0].style = "";
        document.getElementsByClassName("has-ticket")[0].style = "display:none";
    }
}

function confirmOrder(btn) {
    if (validOrder) {
        if (btn.className.split("confirm-btn")[1] == "disable") {} else {
            Order.orderDate = new Date();
            $.getJSON("./json/sessions.json", function(data) {
                $.each(data, function(j, item) {
                    if (item.sessionID == sessionid) {
                        for (var i = 0; i < Order.seatIDs.length; i++) {
                            // item.seats[Order.seatIDs[i]] = true;
                            // alert(Order.seatIDs[i]);
                            item.seats.splice(Order.seatIDs[i], 1, true);
                        }
                    }
                });
            });
            if (confirm("订票成功！请返回主页")) {
                window.opener = null;
                window.open('index.html', '_self');
            } else {}
            // document.getElementById("top").style.display = "block";
            // document.getElementById("mask").style.display = "block";
        }
    }
}