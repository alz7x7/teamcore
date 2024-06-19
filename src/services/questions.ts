import {makeRequest} from '../services/';

const token =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NzM0NzU4MTEsImV4cCI6MTcwNTAxMTgxMSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.9wqriO_2Q8Xfwc9VcgMpr-2c4WVdLRJ5G6NcNaXdpuY';

const getQuestions = async () => {
  try {
    const response = await makeRequest({
      url: 'test_mobile/api/questions',
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const saveQuestions = async (data: any) => {
  try {
    const response = await makeRequest({
      url: 'test_mobile/api/answer',
      method: 'POST',
      data: data,
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {getQuestions, saveQuestions};
