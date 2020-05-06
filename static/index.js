const MAX_WIDTH = $(window).width();
const MAX_HEIGHT = $(window).height();
const HOLD_DELAY = 10;
const MAX_PROPS = 15;
const PROP_SPEED = 50;
const MAXIMUM_WAIT_PROP_CREATION_TIME = 1000;
const MINIMAL_WAIT_PROP_CREATION_TIME = 500;
const COW_STEP_SIZE = 20;
const FRAME_RATE = 30;
const REFRESH_RATE = 1 / FRAME_RATE;
const COLLISION_DISTANCE = 120;
const COLLISION_SKEW = 0.87;
const FINISH_POINTS = 5;

var cow = $('#cow');
const COW_IMG_WIDTH = cow.children('img').width();
const MAX_RIGHT = MAX_WIDTH - COW_IMG_WIDTH;

var props_div = $('#props');

var base_friend = $('.friend');
var base_enemy = $('.enemy');

var props_arr = [];
var points = 0;
var prop_id = 0;


function get_pos(obj, axis) {
    var pos = obj.css(axis);
    return parseInt(pos.substring(0, pos.length - 2));
}

function get_coordinates(obj) {
    return {
        x: get_pos(obj, 'left'),
        y: get_pos(obj, 'top')
    };
}

function euclidean_distance(obj1, obj2, heuristic_x=1, heuristic_y=1) {
    var obj1_pos = get_coordinates(obj1);
    var obj2_pos = get_coordinates(obj2);

    return ((Math.abs(obj1_pos.x - obj2_pos.x) ** (2 * heuristic_x) + 
             Math.abs(obj1_pos.y - obj2_pos.y) ** (2 * heuristic_y)) ** (1 / 2));
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
    clone.attr('id', ++prop_id);
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

var populating = false;
var collected_ids = [];

var update_callbacks = {
    populate: () => {
        if (props_arr.length < MAX_PROPS && !populating) {
            populating = true;
            setTimeout(() => {
                create_prop();
                populating = false;
            }, get_wait_time());
        }
    },
    check_collision: () => {
        props_arr.forEach(prop => {
            const prop_id = prop.attr('id');
            if (!collected_ids.includes(prop_id) && 
                euclidean_distance(prop, cow, COLLISION_SKEW) < COLLISION_DISTANCE) {
                // remove prop and count point
                const isFriend = prop.hasClass('friend');
                collected_ids.push(prop_id);
                prop.remove();
                points += isFriend ? 1 : -1;
                console.log(`isFriend=${isFriend}, points=${points}`);
            }
        });
    },
    check_finish: () => {
        if (Math.abs(points) >= FINISH_POINTS) {
            Object.keys(update_callbacks).forEach(key => delete update_callbacks[key]);
            props_arr.forEach(prop => prop.remove());

            const win = points > 3;

            window.location.href = win ? '/ending' : '/alternative_ending'
        }
    }
}

function update() {
    // console.log(`Running update functions ${Object.keys(update_callbacks)}`);
    Object.keys(update_callbacks).forEach(key => update_callbacks[key]());
}

$(document).ready(() => setInterval(update, REFRESH_RATE));
