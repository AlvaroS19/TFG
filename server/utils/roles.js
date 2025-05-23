function getRoleByLevel(level) {
  if (level >= 45) return 'inmortal'
  if (level >= 35) return 'campeón'
  if (level >= 28) return 'heroico'
  if (level >= 22) return 'leyenda'
  if (level >= 17) return 'maestro'
  if (level >= 13) return 'élite'
  if (level >= 9)  return 'guerrero'
  if (level >= 7)  return 'aventurero'
  if (level >= 4)  return 'explorador'
  return 'novato'
}

module.exports = { getRoleByLevel }
