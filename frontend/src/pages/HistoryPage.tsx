import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Paper,
  Divider,
  Skeleton,
} from '@mui/material';
import { palette } from '../theme/palette';
import type { CollectionHistory } from '../types';
import { fetchCollectionHistory } from '../services/newsService';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

export const HistoryPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState<CollectionHistory[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      const data = await fetchCollectionHistory();
      setHistoryData(data);
      setIsLoading(false);
    };
    loadHistory();
  }, []);

  const selectedHistory = historyData.find((h) => h.date === selectedDate);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: palette.primary.main,
            mb: 1,
          }}
        >
          収集履歴
        </Typography>
        <Typography variant="body2" color="text.secondary">
          過去7日分のニュース収集結果を確認できます
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Date List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: palette.grey[500],
                fontWeight: 600,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              収集日一覧
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={70} sx={{ borderRadius: 1 }} />
                ))
              ) : historyData.map((history) => (
                <Card
                  key={history.date}
                  sx={{
                    boxShadow: 'none',
                    border: `1px solid ${selectedDate === history.date ? palette.secondary.main : palette.grey[200]}`,
                    backgroundColor: selectedDate === history.date ? '#eff6ff' : '#fff',
                  }}
                >
                  <CardActionArea
                    onClick={() => setSelectedDate(history.date)}
                    sx={{ p: 2 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: palette.text.primary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {formatDate(history.date)}
                          {isToday(history.date) && (
                            <Chip
                              label="今日"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: palette.success.light,
                                color: palette.success.dark,
                              }}
                            />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {history.keywords.slice(0, 3).join('、')}
                          {history.keywords.length > 3 && '...'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: palette.primary.main,
                          color: '#fff',
                          borderRadius: '8px',
                          px: 1.5,
                          py: 0.5,
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        {history.totalCount}
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Detail View */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            {selectedDate ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary.main }}>
                    {formatDate(selectedDate)}の収集結果
                  </Typography>
                  <Chip
                    label={`${selectedHistory?.totalCount || 0}件`}
                    sx={{
                      backgroundColor: palette.primary.main,
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(selectedHistory?.newsItems || []).map((news) => (
                    <Card
                      key={news.id}
                      sx={{
                        boxShadow: 'none',
                        border: `1px solid ${palette.grey[200]}`,
                        '&:hover': {
                          borderColor: palette.secondary.main,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: palette.secondary.main, fontWeight: 600 }}
                          >
                            {news.source}
                          </Typography>
                          <Chip
                            label={news.keyword}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: '#eff6ff',
                              color: '#1d4ed8',
                            }}
                          />
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {news.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {news.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: 300,
                }}
              >
                <Typography color="text.secondary" textAlign="center">
                  左のリストから日付を選択してください
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
