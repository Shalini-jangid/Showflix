import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, Clock, ChevronLeft, Play, Loader } from 'lucide-react';

// TMDB API Configuration
const TMDB_API_KEY = '4ab0a7366545551ed567710b18de6e1e'; // Replace with your actual API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// TMDB API Service
const tmdbService = {
  getTrending: async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching trending shows:', error);
      return [];
    }
  },

  getTopRated: async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching top rated shows:', error);
      return [];
    }
  },

  getPopular: async () => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching popular shows:', error);
      return [];
    }
  },

  searchShows: async (query) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching shows:', error);
      return [];
    }
  },

  getShowDetails: async (showId) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching show details:', error);
      return null;
    }
  },

  getSeasonDetails: async (showId, seasonNumber) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching season details:', error);
      return null;
    }
  }
};

// Utility functions
const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1489599162446-c0fe899de95b?w=500&h=750&fit=crop';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <Loader className="w-8 h-8 text-red-500 animate-spin" />
  </div>
);

// Header Component
const Header = ({ onSearch, searchQuery }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/90 to-transparent p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            ShowFlix
          </h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-red-400 transition-colors duration-300">Home</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">TV Shows</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Movies</a>
          </nav>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search shows..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-black/50 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 w-48 md:w-64"
          />
        </div>
      </div>
    </header>
  );
};

// Show Card Component
const ShowCard = ({ show, onClick }) => {
  return (
    <div 
      onClick={() => onClick(show)}
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 relative"
    >
      <div className="relative overflow-hidden rounded-lg shadow-2xl">
        <img
          src={getImageUrl(show.poster_path, 'w342')}
          alt={show.name}
          className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599162446-c0fe899de95b?w=300&h=450&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-sm md:text-lg mb-2 truncate">{show.name}</h3>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
              <span className="text-white text-xs md:text-sm">{show.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              <span className="text-gray-300 text-xs md:text-sm">{formatDate(show.first_air_date)}</span>
            </div>
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-3 overflow-hidden">
            {show.overview ? (show.overview.length > 80 ? show.overview.substring(0, 80) + '...' : show.overview) : 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Show Carousel Component
const ShowCarousel = ({ title, shows, onShowClick, loading = false }) => {
  if (loading) {
    return (
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4 md:px-6">
          {title}
        </h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mb-8 md:mb-12 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4 md:px-6">
        {title}
      </h2>
      <div className="relative">
        <div className="flex space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-4 scroll-smooth" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {shows.map((show) => (
            <div key={show.id} className="flex-shrink-0 w-48 md:w-64">
              <ShowCard show={show} onClick={onShowClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Episode Card Component
const EpisodeCard = ({ episode, onClick }) => {
  return (
    <div 
      onClick={() => onClick(episode)}
      className="group cursor-pointer bg-gray-900/50 rounded-xl overflow-hidden mb-4 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-[1.02]"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative flex-shrink-0 md:w-80 h-48 md:h-32 overflow-hidden">
          <img
            src={getImageUrl(episode.still_path, 'w300')}
            alt={episode.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1489599162446-c0fe899de95b?w=600&h=340&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute top-2 right-2 bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="p-4 md:p-6 flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
            <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors duration-300 truncate pr-4">
              {episode.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400 flex-shrink-0 mt-1 md:mt-0">
              <span className="whitespace-nowrap">E{episode.episode_number}</span>
              {episode.runtime && (
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <Clock className="w-4 h-4" />
                  <span>{episode.runtime}m</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {episode.vote_average > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 text-sm">{episode.vote_average.toFixed(1)}</span>
              </div>
            )}
            {episode.air_date && (
              <span className="text-gray-400 text-sm whitespace-nowrap">{new Date(episode.air_date).toLocaleDateString()}</span>
            )}
          </div>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base line-clamp-3 overflow-hidden">
            {episode.overview || 'No description available for this episode.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Episode Viewer Component
const EpisodeViewer = ({ show, onBack }) => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    const fetchShowData = async () => {
      setLoading(true);
      try {
        // Get show details first
        const details = await tmdbService.getShowDetails(show.id);
        setShowDetails(details);

        // Get episodes from the first season
        if (details?.seasons?.length > 0) {
          const firstSeason = details.seasons.find(s => s.season_number > 0) || details.seasons[0];
          const seasonData = await tmdbService.getSeasonDetails(show.id, firstSeason.season_number);
          if (seasonData?.episodes) {
            setEpisodes(seasonData.episodes);
          }
        }
      } catch (error) {
        console.error('Error fetching show data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [show.id]);

  const displayShow = showDetails || show;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-96 md:h-[60vh] overflow-hidden">
        <img
          src={getImageUrl(displayShow.backdrop_path || displayShow.poster_path, 'w1280')}
          alt={displayShow.name}
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599162446-c0fe899de95b?w=1280&h=720&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute top-20 md:top-24 left-4 md:left-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-300 mb-6"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Back to Home</span>
          </button>
        </div>
        <div className="absolute bottom-8 left-4 md:left-6 right-4 md:right-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{displayShow.name}</h1>
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold">{displayShow.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">{formatDate(displayShow.first_air_date)}</span>
            </div>
            {displayShow.number_of_seasons && (
              <span className="text-gray-300">{displayShow.number_of_seasons} Season{displayShow.number_of_seasons !== 1 ? 's' : ''}</span>
            )}
          </div>
          <p className="text-gray-300 text-lg max-w-3xl">{displayShow.overview || 'No description available.'}</p>
          {displayShow.genres && (
            <div className="flex flex-wrap gap-2 mt-4">
              {displayShow.genres.map((genre) => (
                <span key={genre.id} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Episodes</h2>
        {loading ? (
          <LoadingSpinner />
        ) : episodes.length > 0 ? (
          <div className="space-y-6">
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onClick={() => console.log('Play episode:', episode.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No episodes available for this show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ show }) => {
  if (!show) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      <img
        src={getImageUrl(show.backdrop_path || show.poster_path, 'original')}
        alt={show.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1489599162446-c0fe899de95b?w=1920&h=1080&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      <div className="absolute bottom-20 left-4 md:left-6 right-4 md:right-6 max-w-2xl">
        <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight break-words">
          {show.name}
        </h1>
        <p className="text-gray-300 text-base md:text-xl mb-6 md:mb-8 leading-relaxed line-clamp-4 overflow-hidden">
          {show.overview || 'Discover amazing TV shows and episodes.'}
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-4 md:mb-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-white text-lg font-semibold">{show.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">{formatDate(show.first_air_date)}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center">
            <Play className="w-5 h-5" />
            <span>Play</span>
          </button>
          <button className="bg-gray-700/80 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-600/80 transition-colors duration-300 w-full sm:w-auto text-center">
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

// API Key Notice Component
const APIKeyNotice = () => (
  <div className="min-h-screen bg-black flex items-center justify-center px-4">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-6">TMDB API Key Required</h2>
      <div className="bg-gray-900/50 rounded-xl p-8 mb-6">
        <p className="text-gray-300 mb-4 leading-relaxed">
          To use this TV Show Discovery Platform, you need to get a free API key from The Movie Database (TMDB).
        </p>
        <ol className="text-left text-gray-300 space-y-2 mb-6">
          <li>1. Visit <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">TMDB API Settings</a></li>
          <li>2. Create a free account if you don't have one</li>
          <li>3. Request an API key</li>
          <li>4. Replace 'your_api_key_here' in the code with your actual API key</li>
        </ol>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-400">
          const TMDB_API_KEY = '<span className="text-red-400">your_api_key_here</span>';
        </div>
      </div>
      <p className="text-gray-400">
        Once you add your API key, refresh the page to start exploring real TV show data!
      </p>
    </div>
  </div>
);

// Main App Component
const TVShowPlatform = () => {
  const [selectedShow, setSelectedShow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [loading, setLoading] = useState({
    trending: true,
    topRated: true,
    popular: true,
    search: false
  });

  const isAPIKeyConfigured = TMDB_API_KEY && TMDB_API_KEY !== 'your_api_key_here';

  useEffect(() => {
    if (!isAPIKeyConfigured) return;
    
    const fetchInitialData = async () => {
      try {
        // Fetch trending shows
        const trending = await tmdbService.getTrending();
        setTrendingShows(trending.slice(0, 12));
        setLoading(prev => ({ ...prev, trending: false }));

        // Fetch top rated shows
        const topRated = await tmdbService.getTopRated();
        setTopRatedShows(topRated.slice(0, 12));
        setLoading(prev => ({ ...prev, topRated: false }));

        // Fetch popular shows
        const popular = await tmdbService.getPopular();
        setPopularShows(popular.slice(0, 12));
        setLoading(prev => ({ ...prev, popular: false }));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [isAPIKeyConfigured]);

  useEffect(() => {
    if (!isAPIKeyConfigured) return;
    
    const searchShows = async () => {
      if (searchQuery.trim()) {
        setLoading(prev => ({ ...prev, search: true }));
        try {
          const results = await tmdbService.searchShows(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching shows:', error);
        } finally {
          setLoading(prev => ({ ...prev, search: false }));
        }
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchShows, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isAPIKeyConfigured]);

  // Check if API key is configured after hooks
  if (!isAPIKeyConfigured) {
    return <APIKeyNotice />;
  }

  const handleShowClick = (show) => {
    setSelectedShow(show);
  };

  const handleBackToHome = () => {
    setSelectedShow(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (selectedShow) {
    return <EpisodeViewer show={selectedShow} onBack={handleBackToHome} />;
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      {searchQuery.trim() ? (
        <div className="pt-20 md:pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 break-words">
              Search Results for "{searchQuery}"
            </h2>
            {loading.search ? (
              <LoadingSpinner />
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {searchResults.map((show) => (
                  <div key={show.id} className="w-full">
                    <ShowCard show={show} onClick={handleShowClick} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-xl">No shows found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <HeroSection show={trendingShows[0]} />
          <div className="relative z-10 -mt-29 md:-mt-30">
            <ShowCarousel
              title="Trending Now"
              shows={trendingShows}
              onShowClick={handleShowClick}
              loading={loading.trending}
            />
            <ShowCarousel
              title="Top Rated"
              shows={topRatedShows}
              onShowClick={handleShowClick}
              loading={loading.topRated}
            />
            <ShowCarousel
              title="Popular Shows"
              shows={popularShows}
              onShowClick={handleShowClick}
              loading={loading.popular}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TVShowPlatform;