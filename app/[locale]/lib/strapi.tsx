const BASE_URL = 'http://api.old-dutch-barbershop.ua'

export async function getStrapiData(url: string) {
  try {
    const response = await fetch(`${BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}
  
