const MAX_WIDTH = $(window).width();
const MAX_HEIGHT = $(window).height();
const HOLD_DELAY = 10;
const MAX_PROPS = 20;
const PROP_SPEED = 50;
const MAXIMUM_WAIT_PROP_CREATION_TIME = 1000;
const MINIMAL_WAIT_PROP_CREATION_TIME = 300;
const COW_STEP_SIZE = 20;

var cow = $('#cow');
const COW_IMG_WIDTH = cow.children('img').width();
const MAX_RIGHT = MAX_WIDTH - COW_IMG_WIDTH;

var props_div = $('#props');

var base_friend = $('.friend');
var base_enemy = $('.enemy');

var props_arr = [];


function get_pos(obj, axis) {
    var pos = obj.css(axis);
    return parseInt(pos.substring(0, pos.length - 2));
}

function set_pos(obj, axis, pos) {
    obj.css(axis, pos);
}

function translate_obj(obj, amount, axis, threshold_check, limit) {
    var pos = get_pos(obj, axis);
    pos += amount;
    if (threshold_check(pos)) {
        pos = limit;
    }
    set_pos(obj, axis, pos);
}

function cow_move_left() {
    translate_obj(cow, -COW_STEP_SIZE, 'left', left => left < 0, 0);
}

function cow_move_right() {
    translate_obj(cow, COW_STEP_SIZE, 'left', left => left > MAX_RIGHT, MAX_RIGHT);
}

function make_move_prop_down(prop) {
    var new_prop_created = false;
    return () => {
        translate_obj(prop, 10, 'top', top => {
            if (top > MAX_HEIGHT) {
                prop.remove();
                if (!new_prop_created) {
                    create_prop();
                    new_prop_created = true;
                }
            }
        }, MAX_HEIGHT);
    };
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

function get_start_position() {
    return 32 + parseInt(Math.random() * (MAX_WIDTH - 64));
}

function create_prop() {
    const base = parseInt(Math.random() * 2) ? base_enemy : base_friend;
    const clone = base.clone();
    clone.removeAttr('hidden');
    set_pos(clone, 'left', get_start_position());
    props_arr.push(clone);
    clone.appendTo(props_div);
    setInterval(make_move_prop_down(clone), PROP_SPEED);
}

function get_wait_time() {
    return MINIMAL_WAIT_PROP_CREATION_TIME + parseInt(Math.random() * (
        MAXIMUM_WAIT_PROP_CREATION_TIME - MINIMAL_WAIT_PROP_CREATION_TIME
    ));
}

$(document).ready(() => {
    setTimeout(() => {
        create_prop();
        setTimeout(() => {
            create_prop();
            setTimeout(() => {
                create_prop();
                setTimeout(() => {
                    create_prop();
                    setTimeout(create_prop, get_wait_time());
                }, get_wait_time());
            }, get_wait_time());
        }, get_wait_time());
    }, get_wait_time());
});
