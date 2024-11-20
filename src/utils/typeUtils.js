export const isSimpleValue = (value) => {
  return typeof value !== 'object' || value === null
}

export const isComplexValue = (value) => {
  return typeof value === 'object' && value !== null
}

export const getValueType = (value) => {
  if (Array.isArray(value)) return 'Array'
  if (value === null) return 'null'
  return typeof value
} 