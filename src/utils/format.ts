import dayjs from 'dayjs'

export const formatDate = (iso?: string) => (iso ? dayjs(iso).format('YYYY-MM-DD HH:mm') : '-')
