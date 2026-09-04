import api from './axios'

export const getRecoveryAnalytics = async () => {

  const response = await api.get('/analytics/recovery')

  return response.data
}