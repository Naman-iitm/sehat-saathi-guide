import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, MessageSquare, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { helpArticles, helpCategories } from '@/data/helpArticles';
import ReactMarkdown from 'react-markdown';

const HelpArticle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const article = useMemo(() => {
        return helpArticles.find(a => a.id === id);
    }, [id]);

    const category = useMemo(() => {
        if (!article) return null;
        return helpCategories.find(c => c.id === article.categoryId);
    }, [article]);

    const relatedArticles = useMemo(() => {
        if (!article) return [];
        return helpArticles
            .filter(a => a.categoryId === article.categoryId && a.id !== article.id)
            .slice(0, 3);
    }, [article]);

    if (!article) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
                    <Button onClick={() => navigate('/help')}>Return to Help Center</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-muted/10">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-hidden whitespace-nowrap">
                    <button onClick={() => navigate('/')} className="hover:text-primary flex items-center gap-1 transition-colors">
                        <Home className="w-3.5 h-3.5" />
                        Home
                    </button>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <button onClick={() => navigate('/help')} className="hover:text-primary transition-colors">
                        Help Center
                    </button>
                    {category && (
                        <>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{category.name}</span>
                        </>
                    )}
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <span className="text-foreground font-medium truncate">{article.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Button
                            variant="ghost"
                            className="mb-6 -ml-2 text-muted-foreground hover:text-primary"
                            onClick={() => navigate('/help')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Help Center
                        </Button>

                        <div className="prose prose-blue dark:prose-invert max-w-none bg-background rounded-3xl p-8 md:p-12 shadow-sm border">
                            <header className="not-prose mb-10 pb-8 border-b">
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        Last updated {new Date(article.lastUpdated).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-4 h-4" />
                                        {article.tags.join(', ')}
                                    </div>
                                </div>
                            </header>

                            <div className="help-content prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
                                <ReactMarkdown
                                    components={{
                                        blockquote: ({ children }) => (
                                            <div className="my-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                                                {children}
                                            </div>
                                        ),
                                    }}
                                >
                                    {article.content}
                                </ReactMarkdown>
                            </div>

                            <footer className="not-prose mt-16 pt-8 border-t">
                                <div className="bg-muted/50 p-8 rounded-2xl text-center">
                                    <h3 className="text-lg font-semibold mb-2">Was this article helpful?</h3>
                                    <div className="flex items-center justify-center gap-4 mt-4">
                                        <Button variant="outline" className="px-8 rounded-full hover:bg-green-500/10 hover:text-green-600 hover:border-green-600 transition-all">Yes</Button>
                                        <Button variant="outline" className="px-8 rounded-full hover:bg-red-500/10 hover:text-red-600 hover:border-red-600 transition-all">No</Button>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-lg font-semibold mb-4 px-2">Related Articles</h3>
                            <div className="space-y-3">
                                {relatedArticles.map((rel) => (
                                    <Card
                                        key={rel.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                                        onClick={() => navigate(`/help/article/${rel.id}`)}
                                    >
                                        <CardContent className="p-4 flex items-start gap-3">
                                            <ChevronRight className="w-4 h-4 mt-1 text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                            <span className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">{rel.title}</span>
                                        </CardContent>
                                    </Card>
                                ))}
                                {relatedArticles.length === 0 && (
                                    <p className="text-sm text-muted-foreground px-2">No related articles found in this category.</p>
                                )}
                            </div>
                        </section>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold">Still need help?</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Our team is available to help you with any further questions you may have.
                                </p>
                                <Button className="w-full" onClick={() => navigate('/contact')}>
                                    Contact Support
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpArticle;
