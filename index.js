const fs = require('fs');
const chalk = require('chalk')
const path = require('path');
const loading = require('loading-cli');
const readExcelFile = require('read-excel-file/node');
const isValidEmailFormat = require('./utils/isValidEmailFormat');
const args = require('yargs')
  .command('validate-email <path-to-file>', 'Validates an email list', function (yargs) {
    return yargs
      .option(
        'format',
        { 
          alias: 'f',
          default: 'excel',
          describe: 'Speficies the file format to be used'
        }
      )
      .option(
        'sheet',
        { 
          alias: 's',
          default: 1,
          describe: 'Speficies the sheet to read'
        }
      )
      .option(
        'header',
        { 
          alias: 'h',
          default: false,
          describe: 'Specifies whether or not the sheet has header'
        }
      )
      .option(
        'output',
        { 
          alias: 'o',
          default: `${path.resolve(__dirname)}/dist`,
          describe: 'Specifies the folder to which write the file in'
        }
      )
  })
  .help()
  .argv;
  
const distFolder = path.resolve(args.output);
const pathToFile = args.pathToFile;
const fileFormat = args.format;
const sheetToRead = args.sheet;
const hasHeader = args.header;

let loader = loading("Processing file").start();

if(fileFormat === 'excel') {
  readExcelFile(pathToFile, { sheet: sheetToRead })
    .then(rows => {
      let parsedInfo = rows.reduce((validCSV, row, rowIndex) => {
        // is no header row && has valid values in both, names and email and is valid email format
        if( !(hasHeader && rowIndex === 0) && row[0] && row[1] && isValidEmailFormat(row[1]) && !validCSV.includes(row[1]) ) {
          validCSV.push(`${row[0]},${row[1].toLowerCase()}\n`)
        }
        return validCSV;
      }, []).join('');

      loader.succeed('File processed');
      loader = loading(`Generating output file`).start();

      if(!fs.existsSync(distFolder)) {
        fs.mkdirSync(distFolder);
      }

      if(fs.existsSync(`${distFolder}/emails.output.csv`)) {
        fs.unlinkSync(`${distFolder}/emails.output.csv`);
      }

      fs.writeFileSync(`${distFolder}/emails.output.csv`, parsedInfo);

      loader.succeed(`File written to ${chalk.green(`${distFolder}/emails.output.csv`)}`);
    })
    .catch(err => {
      loader.fail('Error when processing file');
      console.log(err);
    })
}