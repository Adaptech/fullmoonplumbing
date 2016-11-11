import {randomBytes} from 'crypto';

export function getTypeName(obj) {
  if (obj && obj.constructor && obj.constructor.name) {
    return obj.constructor.name;
  }
  return typeof obj;
}

const POSSIBLE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function generateRandomCode(length) {
  let buf = randomBytes(length);
  let chars = [];
  for (let i = 0; i < length; i++) {
    var ch = buf[i] % 36;
    chars.push(POSSIBLE_CHARS[ch]);
  }
  return chars.join('');
}

function newCall(Cls, args) {
  return new (Function.prototype.bind.apply(Cls, [Cls].concat(args)));
}

export function newInject(Cls, services) {
  const code = Cls.toString();
  const m = code.match(new RegExp(Cls.name + '\\(([^)]+)\\)'));
  if (!m || !m[1]) throw new Error('Couldn\'t parse class ' + Cls.name + ' constructor.');
  const params = m[1].split(',');
  const args = params.map(param => {
    const p = param.trim();
    return services[p];
  });
  return newCall(Cls, args);
}
