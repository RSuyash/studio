import React, { useEffect, useState } from 'react';
import { fetchDataFromFirestore } from '../services/dataService';

interface DataItem {
  id: string;
  // Add other properties of your data items here
  name: string;
  // ...
}

const MyFirestoreComponent: React.FC = () => {
  const [myData, setMyData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDataFromFirestore('myCollection');
        setMyData(data as DataItem[]); // Type assertion assuming fetchDataFromFirestore returns an array of DataItem or similar
        console.log('Fetched data:', data);
      } catch (err) {
        setError('Error fetching data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Data from Firestore:</h2>
      {myData.length > 0 ? (
        <ul>
          {myData.map((item) => (
            <li key={item.id}>{item.name}</li>
            // Render other properties of your data item here
          ))}
        </ul>
      ) : (
        <p>No data found in 'myCollection'.</p>
      )}
    </div>
  );
};

export default MyFirestoreComponent;