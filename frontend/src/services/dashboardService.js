const API_BASE_URL = import.meta.env.VITE_API_URL

export const getDashboardStats = async (period = 30) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_BASE_URL}/dashboard/stats?period=${period}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to load dashboard stats: ${response.status}`
    )
  }

  return response.json()
}