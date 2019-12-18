export default function(req, res) {
  const query = req.query
  console.log('------', query)
  res.status(200).json({
    code: 0
  })
}
