const fs = require('fs')

console.log('reading input file')
try {
    // read file all at once
    fs.readFile('./input.txt', 'utf-8', (err, data) => {
        if (err) {
            throw err
        }
        let output = []
        // since tests are separated by empty lines 
        const tests = data.split('\n\n')

        // Iterate over each test
        tests.forEach(test => {
            // Get all lines in a test
            const lines = test.trim().split('\n')

            // First line is the test number
            const testNumber = lines[0]
            
            // Second line is the number of tasks (n)
            const taskN = lines[1]

            // The last line in the test is the initial data change
            const initialDataChange = lines[lines.length - 1]

            // Create a map of each input => {counter, output}
            const inputMap = new Map()

            // Iterate over each task line
            for (let counter = 0; counter <= taskN - 1; counter++) {
                // tasks start from index 2 of the test lines
                const task = lines[counter + 2]

                // each task is separated by ';'
                const [inputString, outputString] = task.split(';')

                // separate each input
                const inputs = inputString.split(',')

                // separate each output
                const outputs = outputString.split(',')

                // iterate over each input to create a input map
                inputs.forEach(input => {
                    inputMap.set(input, {
                        counter,
                        outputs
                    })
                })
            }

            // Use a queue to keep track of the input changes
            const inputQueue = initialDataChange.split(',')

            // Use a list to keep track of the executed tasks
            const executedTasks = []
            while (inputQueue.length !== 0) {
                // get the first input from the queue and remove from queue
                const input = inputQueue.shift()

                // if input triggers a task
                if (inputMap.has(input)) {

                    // get counter and output corresponding to the map
                    const {counter, outputs} = inputMap.get(input)

                    // check if the task was already executed
                    if (executedTasks.includes(counter)) {
                        // skip
                    } else {
                        // if not, then add the task counter to the executed tasks list
                        executedTasks.push(counter)
                        // and push the outputs to the input queue
                        inputQueue.push(...outputs)
                    } 
                } 
            }

            output.push(`${testNumber}${executedTasks.sort().join(',')}`)
        });

        // write to file
        fs.writeFile('./output.txt', output.join('\n'), err => {
            if (err) {
                throw err
            }

            console.log('output saved')
        })
    })
} catch(err) {
    console.error(err)
}
