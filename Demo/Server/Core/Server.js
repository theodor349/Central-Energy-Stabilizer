const functions = {
  test: (a, b) => test(a, b),
}

function test(a, b) {
  return a + b;
}

module.exports = functions;