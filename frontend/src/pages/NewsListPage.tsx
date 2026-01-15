import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Link,
  Paper,
  Skeleton,
} from '@mui/material';
import { palette } from '../theme/palette';
import type { NewsItem } from '../types';
import { fetchLatestNews } from '../services/newsService';

const KEYWORDS = ['すべて', '足立区', '北千住', '竹ノ塚', '西新井', '綾瀬', '梅島', '五反野', '青井', '六町', '舎人', '花畑', '千住'];

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return '1時間未満';
  if (diffHours < 24) return `${diffHours}時間前`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}日前`;
};

export const NewsListPage = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('すべて');
  const [isLoading, setIsLoading] = useState(true);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const data = await fetchLatestNews();
      setNewsData(data);
      setIsLoading(false);
    };
    loadNews();
  }, []);

  const filteredNews = useMemo(() => {
    if (selectedKeyword === 'すべて') {
      return newsData;
    }
    return newsData.filter((news) => news.keyword === selectedKeyword);
  }, [selectedKeyword, newsData]);

  const lastUpdated = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: palette.primary.main,
                mb: 1,
              }}
            >
              本日の足立区ニュース
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="更新済み"
                size="small"
                sx={{
                  backgroundColor: palette.success.light,
                  color: palette.success.dark,
                  fontWeight: 500,
                  fontSize: '0.8rem',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                最終更新: {lastUpdated}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Filter Section */}
      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          backgroundColor: '#fff',
          border: `1px solid ${palette.grey[200]}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: palette.grey[500],
            fontWeight: 500,
            mb: 1.5,
          }}
        >
          キーワードで絞り込み
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {KEYWORDS.map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              onClick={() => setSelectedKeyword(keyword)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(selectedKeyword === keyword
                  ? {
                      background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`,
                      color: '#fff',
                      boxShadow: `0 2px 8px rgba(30, 58, 95, 0.3)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${palette.primary.light}, ${palette.primary.main})`,
                      },
                    }
                  : {
                      backgroundColor: palette.grey[100],
                      color: palette.grey[600],
                      border: `1px solid ${palette.grey[200]}`,
                      '&:hover': {
                        backgroundColor: palette.grey[200],
                      },
                    }),
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* News List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isLoading ? (
          // Loading Skeleton
          [...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="100%" height={28} sx={{ my: 1 }} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" width={60} height={24} sx={{ mt: 1.5, borderRadius: 1 }} />
              </CardContent>
            </Card>
          ))
        ) : filteredNews.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              該当するニュースがありません
            </Typography>
          </Paper>
        ) : (
          filteredNews.map((news) => (
            <Card
              key={news.id}
              component={Link}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  transform: 'translateX(5px)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: palette.secondary.main,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {news.source}
                  </Typography>
                  <Typography variant="caption" sx={{ color: palette.grey[400] }}>
                    {formatTimeAgo(news.pubDate)}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: palette.text.primary,
                    lineHeight: 1.5,
                    mb: 1,
                  }}
                >
                  {news.title}
                </Typography>
                {news.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: palette.grey[500],
                      lineHeight: 1.6,
                      mb: 1.5,
                    }}
                  >
                    {news.description}
                  </Typography>
                )}
                <Chip
                  label={news.keyword}
                  size="small"
                  sx={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                />
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};
