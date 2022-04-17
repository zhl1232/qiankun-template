import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import localizeFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizeFormat)
dayjs.tz.setDefault(dayjs.tz.guess())
export default dayjs
