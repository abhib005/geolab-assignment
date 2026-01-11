import { useEffect, useMemo, useState } from 'react'
import {
    Box, Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Alert,
    CircularProgress,
    IconButton,
    Typography,
    Card,
    CardContent,
    CardActionArea
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';


interface NewsArticle {
    article_id: string;
    title: string;
    description: string;
    pubDate: string;
    source_name: string;
    language: string;
    link: string;
    country?: string[];
}

const NewsPage = ({ setHeaderText }: { setHeaderText: (callback: () => string) => void }) => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [newsCountry, setNewsCountry] = useState<string>('us');
    const [newsSearch, setNewsSearch] = useState<string>('');
    const [newsLoading, setNewsLoading] = useState<boolean>(false);
    const [newsError, setNewsError] = useState<string>('');
    const [newsCatagory, setNewsCategory] = useState<string>('environment,science,technology');
    const fetchNews = async () => {
        setNewsLoading(true);
        setNewsError('');
        try {
            const apiKey = 'pub_d4098630c30c4128b51b6033934ffa1d';
            const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=${newsCountry}&category=${newsCatagory}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'success') {
                setNews(data.results || []);
            } else {
                setNewsError('Failed to fetch news');
                console.log('News API error:', data);
            }
        } catch (error) {
            setNewsError('Error fetching news.');
            console.error('Error fetching news:', error);
        } finally {
            setNewsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [newsCountry, newsCatagory]);

    const filteredNews = useMemo(() => {
        if (!newsSearch.trim()) return news.slice(0, 10);
        return news.filter(article =>
            article.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
            article.description?.toLowerCase().includes(newsSearch.toLowerCase())
        ).slice(0, 10);
    }, [news, newsSearch]);

    setHeaderText(() => {
        let title = `News - ${newsCountry.toUpperCase()}`;
        if (selectedArticle) title += ` - "${selectedArticle.title}"`;
        return title;

    });

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Country</InputLabel>
                    <Select
                        value={newsCountry}
                        label="Country"
                        onChange={(e) => setNewsCountry(e.target.value)}
                    >
                        <MenuItem value="us">United States</MenuItem>
                        <MenuItem value="gb">United Kingdom</MenuItem>
                        <MenuItem value="de">Germany</MenuItem>
                        <MenuItem value="fr">France</MenuItem>
                        <MenuItem value="in">India</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={newsCatagory}
                        label="Category"
                        onChange={(e) => setNewsCategory(e.target.value)}
                    >
                        <MenuItem value="environment,science,technology">All</MenuItem>
                        <MenuItem value="environment">Environment</MenuItem>
                        <MenuItem value="science">Science</MenuItem>
                        <MenuItem value="technology">Technology</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    size="small"
                    placeholder="Search articles..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    sx={{ flexGrow: 1, maxWidth: 400 }}
                />
                <Button variant="outlined" onClick={fetchNews} disabled={newsLoading}>
                    {newsLoading ? <CircularProgress size={24} /> : 'Refresh'}
                </Button>
            </Box>

            {newsError && <Alert severity="warning" sx={{ mb: 2 }}>{newsError}</Alert>}

            {newsLoading && !news.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredNews.map((article) => (
                    <Card key={article.article_id}>
                        <CardActionArea onClick={() => setSelectedArticle(article)}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                    <Chip label={article.source_name} size="small" />
                                    <Chip label={article.language.toUpperCase()} size="small" variant="outlined" />
                                    <Chip label={new Date(article.pubDate).toLocaleDateString()} size="small" variant="outlined" />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {article.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>

            <Dialog open={!!selectedArticle} onClose={() => setSelectedArticle(null)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedArticle?.title}
                    <IconButton
                        onClick={() => setSelectedArticle(null)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Chip label={selectedArticle?.source_name} sx={{ mr: 1 }} />
                        <Chip label={selectedArticle?.language.toUpperCase()} variant="outlined" sx={{ mr: 1 }} />
                        <Chip label={selectedArticle ? new Date(selectedArticle.pubDate).toLocaleDateString() : ''} variant="outlined" />
                    </Box>
                    <Typography variant="body1">
                        {selectedArticle?.description}
                    </Typography>
                    {selectedArticle?.link && selectedArticle.link !== '#' && (
                        <Button variant="contained" href={selectedArticle.link} target="_blank" rel="noopener">
                            Read Full Article
                        </Button>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedArticle(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default NewsPage