export const fakeApiUpdate = async <T>(payload: T, ms = 1000): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error("Simulate network error"));
      } else {
        resolve(payload);
      }
    }, ms);
  });
};
