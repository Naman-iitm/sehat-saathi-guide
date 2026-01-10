import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Plus, Trash2, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Recommendation {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
}

const EditProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  // User profile state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [newRecommendation, setNewRecommendation] = useState({
    author: '',
    content: '',
    rating: 5
  });

  // Loading states
  const [saving, setSaving] = useState(false);

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
      
      // Load existing recommendations from localStorage if available
      const savedRecommendations = localStorage.getItem(`recommendations_${user.id}`);
      if (savedRecommendations) {
        try {
          setRecommendations(JSON.parse(savedRecommendations));
        } catch (e) {
          console.error('Error parsing recommendations:', e);
        }
      }
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: language === 'hi' ? 'त्रुटि' : 'Error',
          description: language === 'hi' ? 'छवि 2MB से छोटी होनी चाहिए' : 'Image must be smaller than 2MB',
          variant: 'destructive'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: language === 'hi' ? 'त्रुटि' : 'Error',
          description: language === 'hi' ? 'केवल छवि फ़ाइलें स्वीकार्य हैं' : 'Only image files are accepted',
          variant: 'destructive'
        });
        return;
      }

      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle recommendation input changes
  const handleRecommendationChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecommendation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating change
  const handleRatingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewRecommendation(prev => ({
      ...prev,
      rating: parseInt(value)
    }));
  };

  // Add a new recommendation
  const addRecommendation = () => {
    if (!newRecommendation.author.trim() || !newRecommendation.content.trim()) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'लेखक और सामग्री आवश्यक है' : 'Author and content are required',
        variant: 'destructive'
      });
      return;
    }

    const newRec: Recommendation = {
      id: Date.now().toString(),
      author: newRecommendation.author,
      content: newRecommendation.content,
      rating: newRecommendation.rating,
      date: new Date().toLocaleDateString()
    };

    setRecommendations(prev => [...prev, newRec]);
    setNewRecommendation({ author: '', content: '', rating: 5 });

    // Save to localStorage
    if (user) {
      localStorage.setItem(`recommendations_${user.id}`, JSON.stringify([...recommendations, newRec]));
    }

    toast({
      title: language === 'hi' ? 'सफल' : 'Success',
      description: language === 'hi' ? 'अनुशंसा जोड़ी गई' : 'Recommendation added successfully'
    });
  };

  // Remove a recommendation
  const removeRecommendation = (id: string) => {
    const updatedRecommendations = recommendations.filter(rec => rec.id !== id);
    setRecommendations(updatedRecommendations);

    // Update localStorage
    if (user) {
      localStorage.setItem(`recommendations_${user.id}`, JSON.stringify(updatedRecommendations));
    }

    toast({
      title: language === 'hi' ? 'सफल' : 'Success',
      description: language === 'hi' ? 'अनुशंसा हटा दी गई' : 'Recommendation removed successfully'
    });
  };

  // Save profile updates
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      // In a real app, you would send the data to your backend here
      // For now, we'll just update the local user context
      
      // Process profile picture if uploaded
      let profilePicUrl = '';
      if (profilePicture) {
        // In a real app, you would upload the image to a service
        // For now, we'll just store the base64 representation
        const reader = new FileReader();
        reader.onloadend = async () => {
          profilePicUrl = reader.result as string;
          
          // Update user profile with new data
          await updateProfile({
            ...user,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            profilePic: profilePicUrl
          });

          toast({
            title: language === 'hi' ? 'सफल' : 'Success',
            description: language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया' : 'Profile updated successfully'
          });
          
          setSaving(false);
          navigate('/profile'); // Navigate back to profile page
        };
        reader.readAsDataURL(profilePicture);
      } else {
        // Update user profile without profile picture
        await updateProfile({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        });

        toast({
          title: language === 'hi' ? 'सफल' : 'Success',
          description: language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया' : 'Profile updated successfully'
        });
        
        setSaving(false);
        navigate('/profile'); // Navigate back to profile page
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'प्रोफ़ाइल अपडेट करने में त्रुटि' : 'Error updating profile',
        variant: 'destructive'
      });
      setSaving(false);
    }
  };

  // Cancel editing and go back
  const handleCancel = () => {
    navigate('/profile');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          {language === 'hi' ? 'प्रोफ़ाइल लोड हो रहा है...' : 'Loading profile...'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'hi' ? 'अपनी प्रोफ़ाइल जानकारी अपडेट करें' : 'Update your profile information'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Profile Picture and Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    {language === 'hi' ? 'नाम' : 'Name'}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={language === 'hi' ? 'आपका नाम' : 'Your name'}
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    {language === 'hi' ? 'ईमेल' : 'Email'}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={language === 'hi' ? 'आपका ईमेल' : 'Your email'}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">
                  {language === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={language === 'hi' ? 'आपका फ़ोन नंबर' : 'Your phone number'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'hi' ? 'अनुशंसाएं / प्रशंसापत्र' : 'Recommendations / Testimonials'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Recommendation Form */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">
                    {language === 'hi' ? 'नई अनुशंसा जोड़ें' : 'Add New Recommendation'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="author">
                        {language === 'hi' ? 'लेखक' : 'Author'}
                      </Label>
                      <Input
                        id="author"
                        name="author"
                        value={newRecommendation.author}
                        onChange={handleRecommendationChange}
                        placeholder={language === 'hi' ? 'लेखक का नाम' : 'Author name'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">
                        {language === 'hi' ? 'सामग्री' : 'Content'}
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={newRecommendation.content}
                        onChange={handleRecommendationChange}
                        placeholder={language === 'hi' ? 'अनुशंसा सामग्री' : 'Recommendation content'}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">
                        {language === 'hi' ? 'रेटिंग' : 'Rating'}
                      </Label>
                      <select
                        id="rating"
                        name="rating"
                        value={newRecommendation.rating}
                        onChange={handleRatingChange}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>
                            {num} {language === 'hi' ? 'तारा' : 'Star'}{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button 
                      type="button" 
                      onClick={addRecommendation}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'अनुशंसा जोड़ें' : 'Add Recommendation'}
                    </Button>
                  </div>
                </div>

                {/* Existing Recommendations */}
                <div>
                  <h3 className="font-medium mb-3">
                    {language === 'hi' ? 'मौजूदा अनुशंसाएं' : 'Existing Recommendations'}
                  </h3>
                  {recommendations.length === 0 ? (
                    <p className="text-muted-foreground italic">
                      {language === 'hi' ? 'कोई अनुशंसा नहीं मिली' : 'No recommendations found'}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="border rounded-lg p-4 relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{rec.author}</h4>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < rec.rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{rec.date}</p>
                              <p className="mt-2">{rec.content}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRecommendation(rec.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Profile Picture */}
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'hi' ? 'प्रोफ़ाइल चित्र' : 'Profile Picture'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  {profilePicturePreview ? (
                    <AvatarImage src={profilePicturePreview} alt={user.name} />
                  ) : (
                    <AvatarImage src={user.profilePic} alt={user.name} />
                  )}
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <label 
                  htmlFor="profilePicture" 
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <span className="sr-only">
                    {language === 'hi' ? 'चित्र अपलोड करें' : 'Upload picture'}
                  </span>
                </label>
                
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-3 text-center">
                {language === 'hi' 
                  ? 'JPEG, PNG या JPG अपलोड करें (2MB से कम)' 
                  : 'Upload JPEG, PNG, or JPG (under 2MB)'}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...'
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile'}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="w-full"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;