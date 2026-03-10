import Passwd from '../models/passwd.ts';

//const MIN_PASSWORD_LENGTH = 16;

function web_crypto_passwd_gen() {
    const array: Uint32Array = new Uint32Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (num) => num.toString(16).padStart(8, '0')).join('');
}

export function check_reused_passwd(password: string) {
    //TODO
}

export function gen_passwd(method: string) {
    switch (method) {
        case 'web_crypto':
            return web_crypto_passwd_gen();
        default:
            return web_crypto_passwd_gen();
    }
}

export function save_passwd(name: string, passwd: string) {
    const new_passwd = new Passwd({
        name: name,
        passwd: passwd,
    });
    return new_passwd.save();
}