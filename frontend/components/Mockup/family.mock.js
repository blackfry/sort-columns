import familyData from './familyData.json'

export function GET(url, data, headers) {
  console.log('family.mock.js: POST called', 'url=', url, 'data=', data);
  return new Promise((resolve, reject) => resolve(familyData))
}
