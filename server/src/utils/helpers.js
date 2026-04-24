/**
 * Format anime DB row to frontend expected format.
 */
function formatAnimeItem(anime) {
  return {
    id: anime.id,
    title: anime.title,
    meta: `${typeLabel(anime.type)} · ${anime.release_date ? new Date(anime.release_date).getFullYear() : '-'}`,
    aspectRatio: anime.poster_vertical_url ? '2:3' : '16:9',
  };
}

function typeLabel(type) {
  const map = { series: 'TV动画', movie: '剧场版' };
  return map[type] || 'TV动画';
}

/**
 * Format banner item for hero carousel.
 */
function formatBannerItem(anime) {
  return {
    id: anime.id,
    title: anime.title,
    description: anime.synopsis || '',
    placeholderAspect: '16:9',
  };
}

/**
 * Build pagination meta from total and query params.
 */
function paginationMeta(total, page, limit) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = {
  formatAnimeItem,
  formatBannerItem,
  paginationMeta,
};
