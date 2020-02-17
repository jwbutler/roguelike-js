/**
 * @param {!int} min
 * @param {!int} max inclusive
 * @return {!int}
 * @private
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @template {T}
 * @param {!T[]} list
 * @return {T} null if `list` is empty
 * @private
 */
function randChoice(list) {
  return list[randInt(0, list.length - 1)] || null;
}

/**
 * Fisher-Yates.  Stolen from https://bost.ocks.org/mike/shuffle/
 *
 * @template <T>
 * @param {T[]} list
 * @returns {void}
 */
function shuffle(list) {
  let n = list.length;

  // While there remain elements to shuffle...
  while (n > 0) {
    // Pick a remaining element...
    const i = randInt(0, n - 1);

    // And swap it with the current element.
    const tmp = list[i];
    list[n] = list[i];
    list[i] = tmp;
    n--;
  }
}

function weightedRandom(probabilityMap: { [key: string]: number }): string {
  const total = Object.values(probabilityMap).reduce((a, b) => a + b);
  const rand = Math.random() * total;
  let counter = 0;
  const entries = Object.entries(probabilityMap);
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    counter += value;
    if (counter > rand) {
      return key;
    }
  }

  throw 'fux';
}

export {
  randInt,
  randChoice,
  weightedRandom,
  shuffle
};