import { getJSON } from '../CommonUtil/CommonUtil';

export const loadFamilyData = (email, userId) => (dispatch) => {
  getJSON('api/family')
    .then((response) => {
      dispatch({
        type: 'LOAD_FAMILY_DATA',
        payload: response
      });
    })
}
