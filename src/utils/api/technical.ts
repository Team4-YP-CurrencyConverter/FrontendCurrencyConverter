import api from './api.ts';

interface ITechnicalResponse {
  response: string;
}

async function getTechnicalInfo() {
  try {
    return await api<ITechnicalResponse[]>({
      method: 'GET',
      endPath: '/technical',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
  } catch (error) {
    console.error(error);
    return [{ response: '0' }];
  }
}

export default getTechnicalInfo;
