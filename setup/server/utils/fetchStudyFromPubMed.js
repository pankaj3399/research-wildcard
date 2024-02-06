const axios = require('axios');

async function fetchStudyFromPubMed(pubmedId) {
    try {
        const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pubmedId}&retmode=json`;
        const response = await axios.get(url);
        const studyData = response.data.result[pubmedId];

        // Extract and return the necessary study details
        if (studyData) {
            const { title, authors, pubdate } = studyData;
            return {
                title,
                authors: authors.map(author => author.name),
                pubdate
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching study from PubMed:', error);
        return null; // or appropriate error handling
    }
}

module.exports = fetchStudyFromPubMed;
