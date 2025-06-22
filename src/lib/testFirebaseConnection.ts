import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Assuming firebase.ts is in the same directory

async function testFirebaseConnection() {
  try { 
    const testCollectionRef = collection(db, 'testCollection');
    const querySnapshot = await getDocs(testCollectionRef);

    if (!querySnapshot.empty) {
      console.log('Successfully connected to Firebase and fetched data from testCollection.');
      querySnapshot.forEach((doc) => {
        console.log('Document data:', doc.data());
      });
    } else {
      console.log('Successfully connected to Firebase, but testCollection is empty.');
    }
  } catch (error) {
    console.error('Error testing Firebase connection:', error);
  }
}
export { testFirebaseConnection };

// Example of how to call the function:
// testFirebaseConnection();