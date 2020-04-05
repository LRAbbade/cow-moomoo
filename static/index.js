const MAX_WIDTH = $(window).width();
const HOLD_DELAY = 10;

var cow = $('#cow');
const COW_IMG_WIDTH = cow.children('img').width();
const MAX_RIGHT = MAX_WIDTH - COW_IMG_WIDTH;

var friends_arr = $('#friends');
var enemies_arr = $('#enemies');
var base_enemy = $('#base-enemy');
var base_friend = $('#base-friend');

$(document).ready(() => {
    
});

function get_pos(obj) {
    var left = obj.css('left');
    return parseInt(left.substring(0, left.length - 2));
}

function translate_obj(obj, amount, threshold_check, limit) {
    var left = get_pos(obj);
    left += amount;
    if (threshold_check(left)) {
        left = limit;
    }
    obj.css('left', left);
}

function cow_move_left() {
    translate_obj(cow, -10, left => left < 0, 0);
}

function cow_move_right() {
    translate_obj(cow, 10, left => left > MAX_RIGHT, MAX_RIGHT);
}

$("#left-arrow").click(() => {
    cow_move_left();
});

$("#right-arrow").click(() => {
    cow_move_right();
});

$("#left-arrow").mousedown(() => {
    intervalId = setInterval(() => {
        cow_move_left();
    }, HOLD_DELAY);
}).mouseup(() => {
    clearInterval(intervalId);
});

$("#right-arrow").mousedown(() => {
    intervalId = setInterval(() => {
        cow_move_right();
    }, HOLD_DELAY);
}).mouseup(() => {
    clearInterval(intervalId);
});
