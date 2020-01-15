const { exec } = require('child_process')

exec(`source $NVM_DIR/nvm.sh && nvm use v10`, (error, stdout, stderr) => {
  if (error) {
    console.log(error)
  } else {
    console.log(stdout)
    console.log(stderr)
  }
})
