// import invariant from 'invariant';
import { iconStatus, startCode, endCode } from '../../constants/utils';

import { Icon } from '../../model';

export function* statistic(next) {
  const icons = yield Icon.findAndCountAll({
    attributes: ['id', 'name', 'code', 'path'],
    where: { status: { $in: [iconStatus.DISABLED, iconStatus.RESOLVED] } },
    order: 'code asc',
  });

  const length = endCode - startCode + 1;
  const data = [];
  const list = [];
  for (let i = 0; i < length; i++) {
    if (i % 16 === 0) {
      const num = startCode + i;
      list.push(num.toString(16).toUpperCase());
    }
    data.push({});
  }

  icons.rows.forEach(icon => {
    const { code } = icon;
    const index = code - parseInt(startCode, 10);
    data[index] = icon;
  });

  // 统计跳过的编码
  let totalSkiped = 0;
  const oldMaxCode = yield Icon.max('code');
  const newMaxCode = yield Icon.max('code', {
    where: { code: { lt: 0xF000 } },
  });
  for (let i = 0; i <= oldMaxCode - startCode; i++) {
    if (!data[i].code) {
      ++totalSkiped;
    }
  }

  const result = {};
  result.data = data;
  result.skiped = totalSkiped - (0xF000 - newMaxCode);

  result.list = list;
  result.count = icons.count;
  result.total = endCode - startCode + 1;
  this.state.respond = result;
  yield next;
}