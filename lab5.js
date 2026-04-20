function asyncMapCallback(arr, asyncFn, finalCallback) {
    const results = [];
    let completed = 0;
    let hasError = false;

    if (arr.length === 0) {
        return finalCallback(null, results);
    }

    arr.forEach((item, index)=> {
        asyncFn(item, (err, result)=> {
            if(hasError) return;

            if (err) {
                hasError = true;
                return finalCallback(err);
            }

            results[index]=result;
            completed++;

            if (completed === arr.length) {
                finalCallback(null, results);
            }
        });
    });
}

function asyncMapPromise(arr, asyncFn) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    let hasError = false;

    if (arr.length === 0) {
      return resolve(results);
    }

    arr.forEach((item, index) => {
      Promise.resolve(asyncFn(item))
        .then(result => {
          if (hasError) return;

          results[index] = result;
          completed++;

          if (completed === arr.length) {
            resolve(results);
          }
        })
        .catch(err => {
          if (!hasError) {
            hasError = true;
            reject(err);
          }
        });
    });
  });
}

async function asyncMapAwait(arr, asyncFn) {
  const results = [];

  for (let i = 0; i < arr.length; i++) {
    const value = await asyncFn(arr[i]);
    results.push(value);
  }

  return results;
}
