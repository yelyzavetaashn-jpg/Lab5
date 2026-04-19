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