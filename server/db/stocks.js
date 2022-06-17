const connection = require('./connection')

function getAllStocks(db = connection) {
  return db('stocks')
    .join('medicines', 'stocks.med_name', 'medicines.med_name')
    .select(
      'code',
      'stocks.med_name as medName',
      'total_quantity as totalQuantity',
      'cost'
    )
}

//delete existing stock; based on medName, get medId, add totalQuantity
function updateAllStocks(newStocks, db = connection) {
  deleteAllStocks()
    .then(() => null)
    .catch((error) => console.error(error))

  const stocks = newStocks.map(async (stock) => {
    const stockFormatted = {
      med_name: stock.medName,
      total_quantity: stock.totalQuantity,
    }
    return await db('stocks').insert(stockFormatted)
  })

  return Promise.all(stocks)
}

function deleteAllStocks(db = connection) {
  return db('stocks').delete().where('med_name', '!=', 'null')
}

function updateQuantByName(prescriptions, db = connection) {
  prescriptions.forEach(async (prescription) => {
    return await db('stocks')
      .where('med_name', '=', prescription.medName)
      .decrement('total_quantity', Number(prescription.prescribedQuantity))
  })
  return null
}

module.exports = {
  getAllStocks,
  updateAllStocks,
  updateQuantByName,
}
