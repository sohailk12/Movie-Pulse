const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const updateSearchCount = async (searchTerm,movie)=>{
    //use Appwrite SDK to check if the Search term exists in the database
    //if it does, update the count
    //if it doesn't, create a new row with the search term and count as 1
}
