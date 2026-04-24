const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/rss
router.get('/rss', async (req, res, next) => {
  try {
    const animes = await db('animes')
      .orderBy('upload_date', 'desc')
      .limit(20);

    const siteUrl = `${req.protocol}://${req.get('host')}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
    xml += `  <channel>\n`;
    xml += `    <title>ANIME - 动漫影视最新发布</title>\n`;
    xml += `    <link>${siteUrl}</link>\n`;
    xml += `    <description>ANIME 动漫平台最新发布的动漫影视作品</description>\n`;
    xml += `    <language>zh-CN</language>\n`;
    xml += `    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>\n`;
    xml += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n\n`;

    animes.forEach((anime) => {
      const date = anime.upload_date
        ? new Date(anime.upload_date).toUTCString()
        : new Date().toUTCString();

      xml += `    <item>\n`;
      xml += `      <title>${escapeXml(anime.title)}</title>\n`;
      xml += `      <link>${siteUrl}/anime/${anime.id}</link>\n`;
      xml += `      <description><![CDATA[${anime.synopsis || ''}]]></description>\n`;
      xml += `      <pubDate>${date}</pubDate>\n`;
      xml += `      <guid>${siteUrl}/anime/${anime.id}</guid>\n`;
      if (anime.poster_horizontal_url) {
        xml += `      <enclosure url="${escapeXml(anime.poster_horizontal_url)}" type="image/jpeg"/>\n`;
      }
      xml += `    </item>\n`;
    });

    xml += `  </channel>\n`;
    xml += `</rss>`;

    res.type('application/rss+xml; charset=utf-8').send(xml);
  } catch (err) {
    next(err);
  }
});

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

module.exports = router;
