import { Context, Next } from 'koa';

// NOTE: follow code is server side redux init data fetch example
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min;
const fetchCounter = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getRandomInt(1, 100));
    }, 10);
  });
};
// exampe end ---------------------------------------------------

const ssrFetch = async (ctx: Context, next: Next) => {
  // NOTE: 현재는 모든 ctx에 대해서 항상 server side ajax 하는 형태의 예제 입니다.
  // 서버에서 다른 서버등에 ajax호출시 본 서버의 최종 응답 속도에 영향을 줄 수 있음으로 신중하게 사용해야 합니다.
  const number1 = await fetchCounter();
  const number2 = await fetchCounter();

  // pass data to next middleware(ssr middleware)
  ctx.state.serverFetchedData = { number1, number2 };
  await next();
};

export default ssrFetch;
