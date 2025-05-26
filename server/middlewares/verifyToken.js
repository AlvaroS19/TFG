const { admin } = require('../services/firebase')

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  console.log('🔐 Header recibido:', authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const idToken = authHeader.split(' ')[1]

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.uid = decodedToken.uid
    console.log('✅ UID verificado:', req.uid)
    next()
  } catch (error) {
    console.error('❌ Token verification error:', error)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = verifyToken
