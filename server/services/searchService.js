import { cosineSearch, euclideanSearch, mmrSearch, hybridSearch } from './pineconeService.js';

// Main search function that runs all 4 algorithms
async function searchDocuments(query, topK = 5) {
  try {
    console.log(`Running search with all 4 algorithms for query: "${query}"`);
    
    const startTime = Date.now();
    
    // Run all search algorithms in parallel
    const [cosineResults, euclideanResults, mmrResults, hybridResults] = await Promise.all([
      measureSearchTime('cosine', () => cosineSearch(query, topK)),
      measureSearchTime('euclidean', () => euclideanSearch(query, topK)),
      measureSearchTime('mmr', () => mmrSearch(query, topK)),
      measureSearchTime('hybrid', () => hybridSearch(query, topK))
    ]);
    
    const totalTime = Date.now() - startTime;
    
    // Calculate performance metrics
    const metrics = calculateMetrics({
      cosine: cosineResults.results,
      euclidean: euclideanResults.results,
      mmr: mmrResults.results,
      hybrid: hybridResults.results
    }, {
      cosine: cosineResults.time,
      euclidean: euclideanResults.time,
      mmr: mmrResults.time,
      hybrid: hybridResults.time
    });
    
    console.log(`Search completed in ${totalTime}ms`);
    
    return {
      searchResults: {
        cosine: cosineResults.results,
        euclidean: euclideanResults.results,
        mmr: mmrResults.results,
        hybrid: hybridResults.results
      },
      metrics,
      totalTime
    };
  } catch (error) {
    console.error('Search service error:', error);
    throw new Error(`Search failed: ${error.message}`);
  }
}

// Helper function to measure search time
async function measureSearchTime(algorithmName, searchFunction) {
  const startTime = Date.now();
  try {
    const results = await searchFunction();
    const endTime = Date.now();
    const time = endTime - startTime;
    
    console.log(`${algorithmName} search completed in ${time}ms, found ${results.length} results`);
    
    return {
      results,
      time
    };
  } catch (error) {
    console.error(`${algorithmName} search error:`, error);
    return {
      results: [],
      time: Date.now() - startTime
    };
  }
}

// Calculate performance metrics for all algorithms
function calculateMetrics(searchResults, responseTimes) {
  const algorithms = ['cosine', 'euclidean', 'mmr', 'hybrid'];
  
  const metrics = {
    precision: {},
    recall: {},
    diversity: {},
    response_time: {}
  };
  
  // Get all unique document IDs across all results
  const allDocIds = new Set();
  algorithms.forEach(alg => {
    searchResults[alg].forEach(doc => allDocIds.add(doc.id.split('_chunk_')[0])); // Remove chunk suffix
  });
  
  const totalRelevantDocs = allDocIds.size;
  
  algorithms.forEach(algorithm => {
    const results = searchResults[algorithm] || [];
    
    // Calculate precision (relevant docs in top 5 results)
    const topResults = results.slice(0, 5);
    const relevantInTop5 = topResults.filter(doc => doc.relevance >= 0.5).length;
    metrics.precision[algorithm] = topResults.length > 0 ? relevantInTop5 / topResults.length : 0;
    
    // Calculate recall (coverage of relevant documents)
    const uniqueDocsFound = new Set(results.map(doc => doc.id.split('_chunk_')[0])).size;
    metrics.recall[algorithm] = totalRelevantDocs > 0 ? uniqueDocsFound / totalRelevantDocs : 0;
    
    // Calculate diversity score
    metrics.diversity[algorithm] = calculateDiversityScore(results);
    
    // Format response time
    metrics.response_time[algorithm] = `${responseTimes[algorithm] || 0}ms`;
  });
  
  return metrics;
}

// Calculate diversity score based on document types and content similarity
function calculateDiversityScore(results) {
  if (results.length <= 1) return 1.0;
  
  // Count unique document types
  const types = new Set(results.map(doc => doc.type));
  const typesDiversity = types.size / Math.min(results.length, 4); // Max 4 types
  
  // Calculate content diversity (simplified)
  let contentDiversity = 0;
  const previews = results.map(doc => doc.preview.toLowerCase());
  
  for (let i = 0; i < previews.length; i++) {
    for (let j = i + 1; j < previews.length; j++) {
      const similarity = calculateTextSimilarity(previews[i], previews[j]);
      contentDiversity += (1 - similarity);
    }
  }
  
  const maxComparisons = (results.length * (results.length - 1)) / 2;
  contentDiversity = maxComparisons > 0 ? contentDiversity / maxComparisons : 1;
  
  // Combine type and content diversity
  return (typesDiversity * 0.6 + contentDiversity * 0.4);
}

// Simple text similarity calculation using word overlap
function calculateTextSimilarity(text1, text2) {
  const words1 = new Set(text1.split(/\s+/).filter(word => word.length > 3));
  const words2 = new Set(text2.split(/\s+/).filter(word => word.length > 3));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Enhanced precision calculation with relevance thresholds
function calculatePrecisionAtK(results, k = 5, relevanceThreshold = 0.5) {
  const topK = results.slice(0, k);
  const relevant = topK.filter(doc => doc.relevance >= relevanceThreshold);
  return topK.length > 0 ? relevant.length / topK.length : 0;
}

// Calculate Mean Average Precision (MAP)
function calculateMAP(results, relevanceThreshold = 0.5) {
  let sumPrecision = 0;
  let relevantCount = 0;
  
  for (let i = 0; i < results.length; i++) {
    if (results[i].relevance >= relevanceThreshold) {
      relevantCount++;
      const precisionAtI = calculatePrecisionAtK(results, i + 1, relevanceThreshold);
      sumPrecision += precisionAtI;
    }
  }
  
  return relevantCount > 0 ? sumPrecision / relevantCount : 0;
}

// Calculate Normalized Discounted Cumulative Gain (NDCG)
function calculateNDCG(results, k = 5) {
  const dcg = results.slice(0, k).reduce((sum, doc, index) => {
    const relevance = doc.relevance;
    const discount = Math.log2(index + 2); // +2 because log2(1) = 0
    return sum + relevance / discount;
  }, 0);
  
  // Calculate ideal DCG (assuming perfect ranking)
  const sortedRelevances = results.map(doc => doc.relevance).sort((a, b) => b - a);
  const idcg = sortedRelevances.slice(0, k).reduce((sum, relevance, index) => {
    const discount = Math.log2(index + 2);
    return sum + relevance / discount;
  }, 0);
  
  return idcg > 0 ? dcg / idcg : 0;
}

// Advanced metrics calculation
function calculateAdvancedMetrics(searchResults) {
  const algorithms = ['cosine', 'euclidean', 'mmr', 'hybrid'];
  const advancedMetrics = {};
  
  algorithms.forEach(algorithm => {
    const results = searchResults[algorithm] || [];
    
    advancedMetrics[algorithm] = {
      map: calculateMAP(results),
      ndcg: calculateNDCG(results),
      precision_at_1: calculatePrecisionAtK(results, 1),
      precision_at_3: calculatePrecisionAtK(results, 3),
      precision_at_5: calculatePrecisionAtK(results, 5)
    };
  });
  
  return advancedMetrics;
}

export {
  searchDocuments,
  calculateMetrics,
  calculateDiversityScore,
  calculateAdvancedMetrics,
  calculatePrecisionAtK,
  calculateMAP,
  calculateNDCG
};