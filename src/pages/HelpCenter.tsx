import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Rocket, User, Pill, Activity, AlertCircle, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { helpCategories, helpArticles } from '@/data/helpArticles';
import { Badge } from '@/components/ui/badge';

const categoryIcons: Record<string, React.ReactNode> = {
    'Rocket': <Rocket className="w-6 h-6" />,
    'User': <User className="w-6 h-6" />,
    'Pill': <Pill className="w-6 h-6" />,
    'Activity': <Activity className="w-6 h-6" />,
    'AlertCircle': <AlertCircle className="w-6 h-6" />
};

const HelpCenter = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredArticles = useMemo(() => {
        let articles = helpArticles;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            articles = articles.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.tags.some(tag => tag.toLowerCase().includes(query)) ||
                article.content.toLowerCase().includes(query)
            );
        }

        if (selectedCategory) {
            articles = articles.filter(article => article.categoryId === selectedCategory);
        }

        return articles;
    }, [searchQuery, selectedCategory]);

    const popularArticles = useMemo(() => {
        return helpArticles.filter(article => article.isPopular);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        How can we help you?
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Search our knowledge base or browse categories below to find answers and guides.
                    </p>
                    <div className="relative group max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search for articles, features, or troubleshooting..."
                            className="pl-12 h-14 text-lg border-primary/20 shadow-lg focus-visible:ring-primary/40 rounded-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Areas */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Categories Grid */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                Browse Categories
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {helpCategories.map((category) => (
                                    <Card
                                        key={category.id}
                                        className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group h-full ${selectedCategory === category.id ? 'border-primary ring-1 ring-primary' : ''}`}
                                        onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                                    >
                                        <CardHeader className="flex flex-row items-start gap-4 pb-4">
                                            <div className={`p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-1`}>
                                                {categoryIcons[category.icon]}
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg leading-tight">{category.name}</CardTitle>
                                                <CardDescription className="text-sm leading-relaxed">{category.description}</CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Articles List */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold">
                                    {searchQuery ? 'Search Results' : selectedCategory ? `${helpCategories.find(c => c.id === selectedCategory)?.name} Articles` : 'Popular Articles'}
                                </h2>
                                {(searchQuery || selectedCategory) && (
                                    <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                                        Clear Filters
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {(searchQuery || selectedCategory ? filteredArticles : popularArticles).map((article) => (
                                    <Card
                                        key={article.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                                        onClick={() => navigate(`/help/article/${article.id}`)}
                                    >
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
                                                    {article.isPopular && <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">Popular</Badge>}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    Last updated: {new Date(article.lastUpdated).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </CardContent>
                                    </Card>
                                ))}

                                {(searchQuery || selectedCategory) && filteredArticles.length === 0 && (
                                    <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed">
                                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium">No articles found</h3>
                                        <p className="text-muted-foreground">Try adjusting your search queries or category filters.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar - Escalation Paths */}
                    <div className="space-y-8">
                        <Card className="bg-primary text-primary-foreground overflow-hidden border-none relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MessageSquare className="w-32 h-32" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl">Still need help?</CardTitle>
                                <CardDescription className="text-primary-foreground/80">
                                    If you couldn't find what you were looking for, our support team is ready to assist you.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                                <Button
                                    className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                                    onClick={() => navigate('/contact')}
                                >
                                    Contact Support
                                </Button>
                                <div className="flex flex-col gap-2 pt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4" />
                                        <span>Available 24/7 for emergencies</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>Typical email response within 2 hours</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Can't wait?</CardTitle>
                                <CardDescription>
                                    Try our AI Assistant for instant help with your health queries.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full" onClick={() => navigate('/assistant')}>
                                    Launch AI Assistant
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
