import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const postsPerPage = 9;

  useEffect(() => {
    fetch('/processed_posts.json')
      .then(response => response.json())
      .then(data => setPosts(data.posts))
      .then(() => {
        // Expand the first post on initial load
        setExpandedPosts(new Set([posts[0]?.id]));
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="app">
      <nav className="navbar">
        <a href="/" className="navbar-brand">Bluebird</a>
        <a href="/contact" className="contact-btn">Contact</a>
      </nav>
      
      <main className="posts-container">
        <div className="posts-grid">
          {currentPosts.map((post) => (
            <div 
              key={post.id} 
              className={`post-card ${expandedPosts.has(post.id) ? 'expanded' : ''}`}
            >
              <div className="post-content">
                <div className="post-date">{new Date(post.timestamp * 1000).toLocaleDateString()}</div>
                <div className="post-text">{post.content}</div>
                {!expandedPosts.has(post.id) && (
                  <div className="readmore-btn" style={{ justifySelf: 'flex-end' }} onClick={() => toggleExpand(post.id)}>
                    Read More
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
