const { program } = require('commander');
const fs = require('fs');

// Налаштування командного рядка
program
    .requiredOption('-i, --input <path>', 'Шлях до вхідного файлу JSON')  // Обов'язковий параметр
    .option('-o, --output <path>', 'Шлях до файлу для збереження результату')  // Необов'язковий
    .option('-d, --display', 'Вивести результат у консоль')  // Необов'язковий
    .option('-f, --filter', 'Фільтрує введені дані');  // Необов'язковий   
program.parse(process.argv);

const options = program.opts();

//CHECK THIS
program.configureOutput({
    outputError: (str, write) => {
        if (str.includes("option '-i, --input <path>' argument missing")) {
            write("Please, specify input file");
        } else {
            write(str);
        }
    },
});

if (options.input == null) {
    console.error("Please, specify input file");
    process.exit(1);
}

if (!fs.existsSync(options.input)) {
    console.error("Cannot find the input file");
    process.exit(1);
}

// Читаємо вхідний файл
const data = fs.readFileSync(options.input, 'utf-8');

if (options.filter) {
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (err) {
        console.error("Input file is not a valid JSON");
        process.exit(1);
    }

    const filteredData = parsedData.filter(field => field.value > 5 && field.ku == 13);
    let filteredDataOut = '';
    for (let i = 0; i < filteredData.length; i++) {
        filteredDataOut += "\n" + filteredData[i].value
    }

    //const filteredDataOut = filteredData[0].value;

    if (filteredData.length === 0) {
        console.warn("Не знайдено жодного об'єкта, що задовольняє умови фільтрації.");
        process.exit(1);
    }

    //const result = JSON.stringify(filteredData, null, 2);
    if (options.display) {
        console.log("Відфільтровані дані:", filteredDataOut);
    }

    if (options.output) {
        fs.writeFileSync(options.output, filteredDataOut, 'utf-8');
        console.log(`Фільтровані дані збережено у файл: ${options.output}`);
    }
    process.exit(1);
}
if (!options.filter) {

    if (!options.filter && options.display) {
        console.log('Дані з файлу:', data);
    }

    if (!options.filter && options.output) {
        fs.writeFileSync(options.output, data);
        console.log(`Результат записано у файл ${options.output}`);
    }
    process.exit(1);
}