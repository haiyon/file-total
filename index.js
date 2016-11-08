const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
let result = { file: 0, mate: 0, line: 0}

rl.question('请输入要统计的路径或文件(' + process.cwd() + '): ', (input) => {
  input = input !== "" ? input : process.cwd();
  rl.question('匹配文件名: ', (key) => {
    run(input, key);
    rl.close();
  });
});

function run(input,key) {
  fs.stat(input, (err, stats) => {
    if (err) {
      console.log('err: 请确认路径或文件...');
      return;
    }
    if(stats.isFile()) {
      let file = fs.readFileSync(input, 'utf-8');
      let fileLine = file.split('\n').length - 1;
      console.log('\n文件: ' + process.cwd() + '/' + input + "\n一共 " + fileLine + " 行\n");
    } else if(stats.isDirectory()) {
      total(input, key);
      console.log('总文件: ' + result.file + ", 总匹配: " + result.mate + " 总行数: " + result.line + "\n");
    }
  });
}

function total(dir, key) {
  let files = fs.readdirSync(dir);
  let fullPath = dir + '/'
  let filesCount = files.length;
  let mateFile = 0;
  let lineCount = 0;

  files.forEach((name) => {
    let fss = fs.statSync(fullPath + name);
    if(fss.isFile()) {
      if (name.indexOf(key) != -1) {
        let file = fs.readFileSync(fullPath + name, 'utf-8');
        let fileLine = file.split('\n').length - 1;
        mateFile++;
        lineCount += fileLine;
      }
    } else if(fss.isDirectory()) {
      total(fullPath + name, key);
    }
  })
  if(mateFile > 0) {
    result.file += filesCount;
    result.mate += mateFile;
    result.line += lineCount;
    console.log('\n目录: ' + dir);
    console.log('文件: ' + filesCount + ", 匹配: " + mateFile + " 行数: " + lineCount + "\n");
  }
}
