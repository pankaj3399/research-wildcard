const axios = require('axios');
const xml2js = require('xml2js'); // Make sure to install xml2js

async function fetchStudyFromPubMed(pubmedId) {
    try {
        const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`;
        const response = await axios.get(url, {
            params: {
                db: 'pubmed',
                id: pubmedId,
                retmode: 'xml',
                rettype: 'abstract'
            }
        });

        // Convert XML response to JSON
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(response.data);

        // Path to the abstract might vary, this is a general example
        const abstractText = result.PubmedArticleSet.PubmedArticle.MedlineCitation.Article.Abstract.AbstractText;

        // You might need to adjust the path based on the structure of the XML
        // Also, handle cases where the abstract or certain parts of the path might be missing
        return {
            title: result.PubmedArticleSet.PubmedArticle.MedlineCitation.Article.ArticleTitle,
            authors: result.PubmedArticleSet.PubmedArticle.MedlineCitation.Article.AuthorList.Author.map(author => `${author.ForeName} ${author.LastName}`).join(', '),
            pubdate: result.PubmedArticleSet.PubmedArticle.MedlineCitation.Article.Journal.JournalIssue.PubDate.Year,
            abstract: abstractText || 'No abstract available'
        };
    } catch (error) {
        console.error('Error fetching study from PubMed:', error);
        return null; // or appropriate error handling
    }
    
}

module.exports = fetchStudyFromPubMed;