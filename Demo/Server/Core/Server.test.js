const server = require('./server.js');

test("Server Test", () => {
  expect(server.test(1, 1)).toEqual(2);
});