const API_BASE_URL = import.meta.env.VITE_API_URL

export const getRecoveryIntelligence = async (paymentId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_BASE_URL}/recovery-intelligence/${paymentId}`,
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
      `Failed to load recovery intelligence: ${response.status}`
    )
  }

  return response.json()
}