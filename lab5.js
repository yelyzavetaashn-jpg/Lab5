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

function asyncMapAbortable(arr, asyncFn, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error("aborted"));
    }

    const results = [];
    let completed = 0;
    let finished = false;

    const abortHandler = () => {
      if (!finished) {
        finished = true;
        reject(new Error("operation aborted"));
      }
    };

    signal?.addEventListener("abort", abortHandler);

    if (arr.length === 0) {
      finished = true;
      signal?.removeEventListener("abort", abortHandler);
      return resolve(results);
    }

    arr.forEach((item, index) => {
      asyncFn(item)
        .then(result => {
          if (finished || signal?.aborted) return;

          results[index] = result;
          completed++;

          if (completed === arr.length) {
            finished = true;
            signal?.removeEventListener("abort", abortHandler);
            resolve(results);
          }
        })
        .catch(err => {
          if (!finished) {
            finished = true;
            signal?.removeEventListener("abort", abortHandler);
            reject(err);
          }
        });
    });
  });
}
