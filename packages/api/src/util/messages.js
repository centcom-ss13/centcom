const m = { // All text for any API response

};

export function getMessage(key) { //split key text into array of keys and retrieve message
  if(!key) {
    return m;
  }

  const parts = key.split('.');
  try {
    return parts.reduce((object, key) => object[key], m);
  } catch (e) {
    throw new Error('Invalid Message Key');
  }
}