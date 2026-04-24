// 生成随机动漫数据
export const generateAnimeItems = (count, aspectRatio = '16:9') => {
  const titles = [
    '进击的巨人 最终季',
    '咒术回战 第二季',
    '鬼灭之刃 游郭篇',
    '间谍过家家',
    '葬送的芙莉莲',
    '孤独摇滚！',
    '我推的孩子',
    '水星的魔女',
    '莉可丽丝',
    '更衣人偶坠入爱河',
    '夏日重现',
    '电锯人',
    '蓝色监狱',
    '国王排名',
    '异世界舅舅',
    '辉夜大小姐想让我告白',
    '排球少年！！',
    '黑子的篮球',
    '刀剑神域',
    '关于我转生变成史莱姆这档事',
  ];

  const types = ['TV动画', '剧场版', 'OVA', '特别篇'];
  const years = ['2024', '2023', '2022', '2021', '2020'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: titles[Math.floor(Math.random() * titles.length)],
    meta: `${types[Math.floor(Math.random() * types.length)]} · ${years[Math.floor(Math.random() * years.length)]}`,
    aspectRatio,
  }));
};

// 生成首页数据
export const homeData = {
  latestReleases: generateAnimeItems(20, '16:9'),
  recentlyAdded: generateAnimeItems(20, '16:9'),
  animeSeries: generateAnimeItems(20, '2:3'),
  trending: generateAnimeItems(20, '16:9'),
};

// 生成完整列表页数据
export const listPageData = {
  latestReleases: generateAnimeItems(50, '16:9'),
  recentlyAdded: generateAnimeItems(50, '16:9'),
  animeSeries: generateAnimeItems(50, '2:3'),
  trending: generateAnimeItems(50, '16:9'),
};