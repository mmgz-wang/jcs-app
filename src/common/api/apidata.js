import { get, post } from 'common/js/api'

export function getDataList (url = '/assets/listGuessingPlan', param = {planIdx: 1}) {
  return get(url, param)
}
