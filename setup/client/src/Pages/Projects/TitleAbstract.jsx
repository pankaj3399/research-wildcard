import React, { useEffect, useState } from 'react';
import '../../Styles/TitleAbstract.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TitleAbstract = () => {
  const [articles, setArticles] = useState([]);
  const [viewArticle, setViewArticle] = useState('');
  const { projectId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchArticles = async () => {
    try {
      const result = await axios(`http://localhost:3000/api/projects/${projectId}/articles`);
      console.log('Articles Fetched: ', result.data); // Check the structure of the response data
      setArticles(Array.isArray(result.data.studies) ? result.data.studies : []);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [projectId]);

  useEffect(() => {
    console.log(articles); // Log articles after setting them
    if (articles && articles.length > 0) {
      const initialViewArticle = getInitialViewArticle(articles);
      setViewArticle(initialViewArticle);
    }
  }, [articles]);


  const handleScreen = async (articleId, titleScreeningStatus) => {
    await axios.put(`http://localhost:3000/api/articles/${articleId}/title-screen`, { titleScreeningStatus });
    setArticles(articles && articles.map(article => article._id === articleId ? { ...article, titleScreeningStatus, needsThirdPartyReview: titleScreeningStatus === 'maybe' } : article));
  };

  const handleView = (article) => {
    setViewArticle(article);
  }

  const getInitialViewArticle = (articles) => {
    return articles.find(article => article.titleScreeningStatus === 'unreviewed') || null;
  };

  const getUndecidedArticlesCount = () => {
    let unreviewedCount = 0;

    articles.forEach(article => {
      if (article.titleScreeningStatus === 'unreviewed') {
        unreviewedCount++;
      }
    });
    return unreviewedCount;
  };

  return (
    <div className='Articles'>
      <div className='header'>Showing {articles.length} filtered out of {articles.length} Articles</div>
      {(articles && articles.length > 0) &&
        <div className='main-body'>
          <div className='articles-sidebar'>
            <div className='articles-sidebar-header'>{getUndecidedArticlesCount()} Undecided</div>
            <div className='articles-sidebar-content'>
              {Array.isArray(articles) && articles.map(article => (
                <div key={article._id} className='sidebar-item'>
                  <div className='seperator'></div>
                  <div className={`sidebar-item-content ${viewArticle?._id === article._id ? 'active-sidebar-item-content' : `non-active-sidebar-item-content ${article.titleScreeningStatus}-article-item`} `} onClick={() => handleView(article)}>
                    <div className='article-title'>{article.title}</div>
                    <div className='article-date'>Date: {new Date(article.publicationDate).toLocaleDateString()}</div>
                    <div className={`article-status ${article.titleScreeningStatus}-article-status`}>{article.titleScreeningStatus !== 'unreviewed' ? article.titleScreeningStatus : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {viewArticle &&
            <div className='article-content'>
              <div className='article-content-title'>{viewArticle.title}</div>
              <div className='article-content-body'>
                <div className='bold'>Abstract:</div>
                <div>{viewArticle.abstract}</div>
              </div>
              <div className='footer'>
                <div className='btns-div'>
                  <button id='btn-1' className='btn' onClick={() => handleScreen(viewArticle._id, 'included')}>Include</button>
                  <button id='btn-2' className='btn' onClick={() => handleScreen(viewArticle._id, 'maybe')}>Maybe</button>
                  <button id='btn-3' className='btn' onClick={() => handleScreen(viewArticle._id, 'excluded')}>Exclude</button>
                </div>
              </div>
            </div>
          }
        </div>
      }
      {/* {Array.isArray(articles) && articles.map(article => (
        <div key={article._id}>
          <h3>{article.title}</h3>
          <p>{article.abstract}</p>
          <button onClick={() => handleScreen(article._id, 'included')}>Include</button>
          <button onClick={() => handleScreen(article._id, 'excluded')}>Exclude</button>
          <button onClick={() => handleScreen(article._id, 'maybe')}>Maybe</button>
          {article.needsThirdPartyReview && <span> (Review Pending)</span>}
        </div>
      ))} */}
    </div>
  );

};

export default TitleAbstract;


