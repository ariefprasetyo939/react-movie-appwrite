import {Client, Databases, ID, Query} from 'appwrite'

const client = new Client();
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client);

export const UpdateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm)]
        );

        //If there is a result
        if(result.documents.length > 0) {
            const doc = result.documents[0];

            //update data
            await database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1
                }
            )
        }

        //If there is no result
        else {
            //create document
            await database.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            );
        }
    } catch (error) {
        console.log("Error updating search count", error);
    }
}

export const GetTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            [
                Query.limit(10),
                Query.orderDesc('count')
            ]
        )

        return result.documents;
    } catch (error) {
        console.log("Error getting trending movies", error);
    }
}