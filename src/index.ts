import './index.css';
import getTechnicalInfo from './utils/api/technical.ts';

const data = await getTechnicalInfo();
console.log(data[0].response);
