const log = (message, type = "info") => {
  const colors = {
    info: "\x1b[36m",    // cyan
    success: "\x1b[32m", // green
    error: "\x1b[31m",   // red
    warning: "\x1b[33m"  // yellow
  };

  console.log(`${colors[type] || colors.info}[LOG]${colors.info} ${message}\x1b[0m`);
};

module.exports = { log };
