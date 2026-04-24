const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  // Clear all tables in order
  await knex('user_anime_list').del();
  await knex('episodes').del();
  await knex('animes').del();
  await knex('users').del();

  // ===== Users =====
  const hashedAdmin = await bcrypt.hash('admin123456', 10);
  const hashedUser = await bcrypt.hash('password123', 10);

  await knex('users').insert([
    {
      id: 1,
      email: 'admin@anime.com',
      password_hash: hashedAdmin,
      nickname: '管理员',
      avatar_url: null,
      role: 'admin',
      status: 'active',
    },
    {
      id: 2,
      email: 'user1@test.com',
      password_hash: hashedUser,
      nickname: '动漫爱好者',
      avatar_url: null,
      role: 'user',
      status: 'active',
    },
    {
      id: 3,
      email: 'user2@test.com',
      password_hash: hashedUser,
      nickname: '追番达人',
      avatar_url: null,
      role: 'user',
      status: 'active',
    },
  ]);

  // ===== Animes =====
  await knex('animes').insert([
    {
      id: 1,
      title: '进击的巨人 最终季',
      synopsis: '人类与巨人的最终决战。墙外的真相即将揭晓，艾伦·耶格尔的选择将决定世界的命运。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Attack+on+Titan',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Attack+on+Titan',
      type: 'series',
      status: 'completed',
      release_date: '2024-01-01',
      upload_date: '2024-01-01 00:00:00',
      is_banner: true,
      banner_order: 1,
      views: 15800,
    },
    {
      id: 2,
      title: '咒术回战 第二季',
      synopsis: '涩谷事变篇开幕。最强咒术师五条悟被封印，咒术界陷入空前危机。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Jujutsu+Kaisen',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Jujutsu+Kaisen',
      type: 'series',
      status: 'ongoing',
      release_date: '2024-03-01',
      upload_date: '2024-03-01 00:00:00',
      is_banner: true,
      banner_order: 2,
      views: 12400,
    },
    {
      id: 3,
      title: '鬼灭之刃 游郭篇',
      synopsis: '音柱·宇髄天元与炭治郎等人潜入游郭，与上弦之陆展开激战。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Demon+Slayer',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Demon+Slayer',
      type: 'series',
      status: 'completed',
      release_date: '2022-12-01',
      upload_date: '2022-12-01 00:00:00',
      is_banner: true,
      banner_order: 3,
      views: 18900,
    },
    {
      id: 4,
      title: '间谍过家家',
      synopsis: '西国顶尖间谍「黄昏」为了任务组建临时家庭，却不知女儿是超能力者，妻子是杀手。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Spy+Family',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Spy+Family',
      type: 'series',
      status: 'ongoing',
      release_date: '2023-04-01',
      upload_date: '2023-04-01 00:00:00',
      is_banner: true,
      banner_order: 4,
      views: 22100,
    },
    {
      id: 5,
      title: '葬送的芙莉莲',
      synopsis: '勇者队伍在打败魔王后各奔东西。精灵魔法使芙莉莲在伙伴离世后，开始了理解人类的旅程。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Frieren',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Frieren',
      type: 'series',
      status: 'ongoing',
      release_date: '2024-04-01',
      upload_date: '2024-04-01 00:00:00',
      is_banner: true,
      banner_order: 5,
      views: 17500,
    },
    {
      id: 6,
      title: '孤独摇滚！',
      synopsis: '极度害羞的女高中生后藤一里，为了克服社交恐惧症而开始学习吉他，梦想站上舞台。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Bocchi+the+Rock',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Bocchi+the+Rock',
      type: 'series',
      status: 'completed',
      release_date: '2022-10-01',
      upload_date: '2022-10-01 00:00:00',
      is_banner: false,
      banner_order: null,
      views: 13200,
    },
    {
      id: 7,
      title: '电锯人',
      synopsis: '少年淀治与链锯恶魔波奇塔一起生活，被债主追债，过着贫困的日子。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Chainsaw+Man',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Chainsaw+Man',
      type: 'series',
      status: 'completed',
      release_date: '2022-10-01',
      upload_date: '2022-10-01 00:00:00',
      is_banner: false,
      banner_order: null,
      views: 19800,
    },
    {
      id: 8,
      title: '我推的孩子',
      synopsis: '偶像星野爱的粉丝转生成为她的孩子，在演艺圈中揭开黑暗真相的故事。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Oshi+no+Ko',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Oshi+no+Ko',
      type: 'series',
      status: 'ongoing',
      release_date: '2023-04-01',
      upload_date: '2023-04-01 00:00:00',
      is_banner: false,
      banner_order: null,
      views: 14500,
    },
    {
      id: 9,
      title: '水星的魔女 剧场版',
      synopsis: '来自水星的少女斯莱塔·墨丘利进入阿斯提卡西亚高等专门学园，驾驶风灵高达展开新的故事。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Gundam+Witch',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Gundam+Witch',
      type: 'movie',
      status: 'completed',
      release_date: '2024-06-01',
      upload_date: '2024-06-01 00:00:00',
      is_banner: false,
      banner_order: null,
      views: 8900,
    },
    {
      id: 10,
      title: '关于我转生变成史莱姆这档事',
      synopsis: '上班族三上悟被刺后转生到异世界成为史莱姆，开启奇幻冒险之旅。',
      poster_horizontal_url: 'https://placehold.co/800x450/1a1a1a/E50914?text=Slime',
      poster_vertical_url: 'https://placehold.co/400x600/1a1a1a/E50914?text=Slime',
      type: 'series',
      status: 'ongoing',
      release_date: '2024-01-01',
      upload_date: '2024-01-01 00:00:00',
      is_banner: false,
      banner_order: null,
      views: 11000,
    },
  ]);

  // ===== Episodes =====
  const episodeData = [];

  const animeEpisodes = {
    1: [
      { num: 1, title: '海的尽头', dur: 1440 },
      { num: 2, title: '黑暗的夜', dur: 1380 },
      { num: 3, title: '未来的选择', dur: 1500 },
      { num: 4, title: '自由的代价', dur: 1440 },
    ],
    2: [
      { num: 1, title: '怀玉', dur: 1380 },
      { num: 2, title: '玉折', dur: 1440 },
      { num: 3, title: '涩谷事变 开幕', dur: 1500 },
      { num: 4, title: '涩谷事变 激战', dur: 1440 },
      { num: 5, title: '涩谷事变 终结', dur: 1380 },
    ],
    3: [
      { num: 1, title: '游郭潜入', dur: 1380 },
      { num: 2, title: '上弦之陆现身', dur: 1440 },
      { num: 3, title: '激战之夜', dur: 1500 },
    ],
    4: [
      { num: 1, title: '黄昏行动', dur: 1440 },
      { num: 2, title: '伪装家庭', dur: 1380 },
      { num: 3, title: '入学考试', dur: 1440 },
      { num: 4, title: '家庭出游', dur: 1380 },
    ],
    5: [
      { num: 1, title: '冒险的终结', dur: 1500 },
      { num: 2, title: '魔法使的日常', dur: 1440 },
      { num: 3, title: '旅行的开始', dur: 1380 },
      { num: 4, title: '北方的土地', dur: 1440 },
    ],
    6: [
      { num: 1, title: '孤独的摇滚', dur: 1380 },
      { num: 2, title: '乐队成立', dur: 1440 },
      { num: 3, title: '第一次演出', dur: 1380 },
    ],
    7: [
      { num: 1, title: '犬与链锯', dur: 1440 },
      { num: 2, title: '到达东京', dur: 1380 },
      { num: 3, title: '猫之味', dur: 1440 },
      { num: 4, title: '救出', dur: 1500 },
    ],
    8: [
      { num: 1, title: '母亲与孩子', dur: 1440 },
      { num: 2, title: '演艺圈', dur: 1380 },
      { num: 3, title: '真相', dur: 1500 },
    ],
    9: [
      { num: 1, title: '水星的少女', dur: 5400 },
      { num: 2, title: '高达之心', dur: 4800 },
    ],
    10: [
      { num: 1, title: '转生', dur: 1440 },
      { num: 2, title: '史莱姆生活', dur: 1380 },
      { num: 3, title: '伙伴们', dur: 1440 },
      { num: 4, title: '建国', dur: 1500 },
      { num: 5, title: '魔王觉醒', dur: 1440 },
    ],
  };

  Object.entries(animeEpisodes).forEach(([animeId, eps]) => {
    eps.forEach((ep) => {
      episodeData.push({
        anime_id: parseInt(animeId),
        episode_number: ep.num,
        title: ep.title,
        video_url: null,
        duration: ep.dur,
      });
    });
  });

  await knex('episodes').insert(episodeData);

  // ===== User Anime List =====
  await knex('user_anime_list').insert([
    { user_id: 2, anime_id: 1 },
    { user_id: 2, anime_id: 2 },
    { user_id: 3, anime_id: 3 },
    { user_id: 3, anime_id: 5 },
  ]);
};
