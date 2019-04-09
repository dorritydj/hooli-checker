const fs = require('fs'); // useful for navigating the file system
const parse = require('csv-parse/lib/sync'); // needed for parsing CSV file data

function linkBuyerToFacility() {
  // your solution goes here

  //read in files as buffer
  const samAccounts = fs.readFileSync('./sam-accounts.csv');
  const existingAccounts = fs.readFileSync('./existing-accounts.csv');

  //parse files using given library
  const samAccountRecords = parse(samAccounts, {
    columns: true
  });
  const existingAccountRecords = parse(existingAccounts, {
    columns: true
  });

  //loop over sam accounts
  //try and find the first instance of the hooli ID in the existing files
  //would prefer to use composition instead of chaining, but unfamaliar enough to be confident with it
  const leftover = samAccountRecords.filter(account => {
    const foundExisting = existingAccountRecords.find(existingAccount => {
      return existingAccount.hooliId.includes(account.accountHooliId);
    });

    return foundExisting === undefined;
  }).map(row => {
    //could do an Object.values on the row, but that assumes the order will be consistent
    //would prefer to format it myself to ensure it doesn't change
    //this puts reliance on the property names however
    return `${row.accountHooliId},${row.samUID}`;
  });

  //in a more realistic scenario, you could pull these from the objects itself in order to be dynamic
  leftover.unshift(['accountHooliId,samUID']);

  //joins the array on new lines, then writes the file
  fs.writeFileSync('./set-difference.csv', leftover.join('\n'));
}

linkBuyerToFacility();
