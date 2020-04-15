const functions = {
  createDevice: (device) => createDevice(device),
  getDevice: (id) => getDevice(id),
  deleteDevice: (id) => deleteDevice(id),
  updateDevice: (id, field, value) => updateDevice(id, field, value),
  createGraph: (id) => createGraph,
  getGraph: (id) => getGraph(id),
  updateGraph: (id, statIndex, values) => updateGraph(id, statIndex, values),
  removePartOfGraph: (id, statIndex, amount) => removePartOfGraph(id, statIndex, amount),
}

module.exports = functions;