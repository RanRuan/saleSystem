
export function isPassword(value) {
    let filter = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
    return filter.test(value);
}

export function isEmail(value) {
    let filter = /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(value);
}

export function isPhoneNumber(value) {
    let filter = /^1[34578]\d{9}$/;
    return filter.test(value);
}

