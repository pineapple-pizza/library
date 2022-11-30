const words = ['aimons', 'argent', 'aspirine', 'ganter', 'garent', 
'garnet', 'gerant', 'girafe', 'greant', 'grenat', 'imagier', 
'ironique', 'lecipo', 'maigrie', 'maison', 'onirique', 'parisien', 
'parisine', 'picole', 'pinerais', 'police', 'poisson', 'ragent', 'regnat', 
'repinais', 'resnipai', 'respinai', 'sniperai', 'spinerai', 'tanger', 'trange'];

const anagram = (words = []) => {
  let result = {};
  
  for (let str of words) {
    let sorted = str.split('').sort().join('');
    result[sorted] ? result[sorted].push(str) : result[sorted] = [str]
  }
  
  return Object.values(result);
}

console.log(anagram(words));
