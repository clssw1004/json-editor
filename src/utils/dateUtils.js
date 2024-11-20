// Format date to YYYYMMDD_HHmmss
export const formatDateTime = (date) => {
  const pad = (num) => String(num).padStart(2, '0')
  
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`
}

// Generate filename with timestamp
export const generateFilename = (originalName) => {
  const timestamp = formatDateTime(new Date())
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  return `${nameWithoutExt}_${timestamp}.json`
} 