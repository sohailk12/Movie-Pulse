import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Validate required environment variables
const requiredEnvVars = {
  VITE_APPWRITE_PROJECT_ID: PROJECT_ID,
  VITE_APPWRITE_DATABASE_ID: DATABASE_ID,
  VITE_APPWRITE_COLLECTION_ID: COLLECTION_ID
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}. ` +
    `Please set these in your .env file or deployment platform.`
  );
}

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID || '');

const database = new Databases(client);

// Helper function to check if Appwrite is configured
const isAppwriteConfigured = () => {
    const configured = Boolean(PROJECT_ID && DATABASE_ID && COLLECTION_ID);
    
    // Debug logging - remove in production
    console.log('Appwrite Config Check:', {
        PROJECT_ID: PROJECT_ID ? 'set' : 'MISSING',
        DATABASE_ID: DATABASE_ID ? 'set' : 'MISSING',
        COLLECTION_ID: COLLECTION_ID ? 'set' : 'MISSING'
    });
    
    return configured;
};

export const updateSearchCount = async (searchTerm, movie) => {
    // Early return if Appwrite is not configured
    if (!isAppwriteConfigured()) {
        console.warn('Appwrite is not configured. Skipping search count update.');
        return;
    }
    
    // Validate input parameters
    if (!searchTerm || !movie) {
        console.warn('Missing required parameters for updateSearchCount.');
        return;
    }
    
    // Use Appwrite SDK to check if the search term exists in the database
    // If it does, update the count
    // If it doesn't, create a new row with the search term and count as 1
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ]);

        if (result.total > 0) {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            });
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''
            });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
};

export const getTrendingMovies = async () =>{
    // Early return if Appwrite is not configured
    if (!isAppwriteConfigured()) {
        console.warn('Appwrite is not configured. Returning empty trending movies.');
        return [];
    }
    
    try {
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}
