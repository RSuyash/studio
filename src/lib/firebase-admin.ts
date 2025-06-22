
import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return;
  }

  const serviceAccount = {
    type: "service_account",
    project_id: "nexus-cortex-plus",
    private_key_id: "ba671049cb96e57151b14d9e97c765b333a79d81",
    private_key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/tFEpa53tPOX5
R2Q74ekaSpvORieOoeid95H14Jv/Nb8Att48XmBWlqq5e7naVv9268SupYZuDP0Y
IFmcwSW4OAuK6nhJwmowSckwAQbVWvTYn6YQ1apoOGM3EODBGRyHQL7VSVQa1biF
zOG/fuJ8y3zjr70jZ4TD4jNPaKRwLsZ6h/nvnPqeb81n7mOQMHKA1WXoC0EI4BAE
8hYz94hL43yO3GFVBRFuhz3RPOH+jjlYuez8hsHbF2Pu0QyiiwJ/ZNvyG+uRfJFJ
nu4Ymi/KT/YAA/dSYsA3yyB72vpcJfztEs0q81B3q9WJJgqiJr9+ICdg7dGx9pgrm
PgclRmXxAgMBAAECggEAA05ejPaSa24+sBkjWSYJAV9ShxDuKzdPHfRQU9t7DUB1
yhMdS5C8HBoumRLRbnrMHpar1nA73IeEUOdz7DBnkGEFD/EBwJHmB22qVtXZspHG
QbslH8qzjOcWDPPRUHs4ovuCnwaL+QeBDmutZAJR8SGIRpv4CNWG9GLhDChLl7Sr
Jw/HCMjwyIIoamaGiM9hzInMvxK63b986krxEPzSCM4PtexVEVE0nJY33iDCZS/l
J5iKH+oZ5I34gwUuo0MlLgAQqr1xHp4FDgZTWw9ftvaPM/yGIyEZCD0NV9rhmOvF
gfNN+aooJ1wF/7+JYSrVlwDhBySQ2lrbc7n8MyLZXQKBgQDsAPTCwjYKzs7BUqsA
LJJ0l/pddv8/mnrN9u3qOHu2A5L9QPMgr5wK963g2xhWWUQ4Ku9EmPEpoDqSypck
+VGzeHVYNJQDfk4Z5fLB8X6ZAe0tMe9aAtk2fDqc2flIqx+7ZC8O1ErqFWqIpV9n
B7Fnh/EvaZNzaXUZxUhmM7Fi/QKBgQDP8nwIyaKai7/eQrCExz0jlUFYiaCaNaJR
rRt5+HObGgfJp+9BvqjbegCARgLnur2cgJbo1pgvuOIf6I53Yw73c9NykhM8Ji0D
BB2eAvGnouA2JXiQv1k2LTRrUE4Qv8wQrC5obBoIZjweCfDUvgY5hgVJZwHCdDxP
gMhYfkiDBQKBgAcEvEKyfeLyZYmwSK+Xo79d6a8v48VjdbV8W3T0uxEdqBhp/xEA
x/Y3iW8/dMjUnMfC1xzGI53mSvekmLwbwgdBVNQLtD8qWW5BvWdxJB+uw/vtGT4n
CYiqRx/1B4nWtPngr9mUDKpLesCXkm/A9dCrZUvQqvbqsvXSPSX08ZiNAoGASrX6
LkYTb6cqBja7qNjUdIZZde/sjbsbWHDzYD0Ne/o8Ng1p/pr7m+8XYv7EaHFFUoc4
sOr4vpyUUZaCKQ6j/+/TVmR5GLE2ltDRu0WfgPUZzRplWMwGx1oybSPrCEWAkbTq
74V3TPE+RCSaLDUhk2U9XQPvM+gDCyVf1bt5XekCgYEAmaeqUJF7PDtrrB/DKerj
PIqrT+Ikjm86qj1IjPJrrQoZPIqhLFK236vdt+LrIUsCLQS/dA+YgalAEA7QBt3W
23KkjZZTpduvK1HWFukG5b48um6siYqqkge8VaPNbOmB8cmulWOjDp2m9gZSWBj6
KB6BGpOVRB+efuWEd1PhZGo=
-----END PRIVATE KEY-----`,
    client_email: "firebase-adminsdk-fbsvc@nexus-cortex-plus.iam.gserviceaccount.com",
    client_id: "101252820943608586514",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nexus-cortex-plus.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  } as admin.ServiceAccount;

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw new Error('Could not initialize Firebase Admin SDK. Check your hardcoded credentials.');
  }
}

/**
 * Returns a memoized instance of the Firebase Admin Firestore database.
 * Initialization is done on the first call.
 */
export function getAdminDb(): admin.firestore.Firestore {
  if (db) {
    return db;
  }

  initializeAdminApp();
  db = admin.firestore();
  return db;
}
