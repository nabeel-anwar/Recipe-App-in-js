import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const resData = await res.json();
    if (!res.ok) throw new Error(`${resData.message} ${res.status}`);
    return resData;
  } catch (error) {
    throw error;
  }
};
export const sendJSON = async function (url, recipe) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const resData = await res.json();
    if (!res.ok) throw new Error(`${resData.message} ${res.status}`);
    return resData;
  } catch (error) {
    throw error;
  }
};
