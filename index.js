const { program } = require('commander');
const fs = require('fs');

program
    .requiredOption('-i, --input <path>', 'Шлях до вхідного файлу JSON')
    .option('-o, --output <path>', 'Шлях до файлу для збереження результату')
    .option('-d, --display', 'Вивести результат у консоль')
    .configureOutput({
        outputError: (str, write) => {
            if (str.includes("error: option '-i, --input <path>' argument missing")) write("Please, specify input file");
        }
    });
program.parse(process.argv);

const options = program.opts();

let parsedData;
try {
    const data = fs.readFileSync(options.input, 'utf-8');

    try {
        parsedData = JSON.parse(data);
    } catch (err) {
        console.error("Input file does not have right JSON structure");
        process.exit(1);
    }
} catch (err) {
    console.error("Cannot find input file");
    process.exit(1);
}

const filteredData = parsedData.filter(field => field.value > 5 && field.ku >= 13);

if (filteredData.length === 0) {
    console.warn("There is no objects");
    process.exit(1);
}

let filteredDataOut = '';

for (let i = 0; i < filteredData.length; i++) {
    filteredDataOut += "\n" + filteredData[i].value
}

if (options.display) {
    console.log("Filtered data:", filteredDataOut);
}

if (options.output) {
    fs.writeFileSync(options.output, filteredDataOut, 'utf-8');
    console.log(`Filtered data saved to file: ${options.output}`);
}
process.exit(1);
