export const SAMPLE_PG_PHOTOS = [
  {
    imageName: 'PG Hostel Building Exterior',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    imageName: 'Student & Working Professional Room with Study Desk',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  },
  {
    imageName: 'PG Common Lounge & Study Area',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  },
  {
    imageName: 'Shared Twin Occupancy PG Bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  },
  {
    imageName: 'PG Shared Mess & Dining Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  },
];

export const getPgPhotos = (pgId, fetchedImages = []) => {
  if (fetchedImages && fetchedImages.length > 0) {
    return fetchedImages;
  }
  // Return deterministic high-res sample photos based on PG ID
  const offset = (Number(pgId) || 1) % SAMPLE_PG_PHOTOS.length;
  const p1 = SAMPLE_PG_PHOTOS[offset % SAMPLE_PG_PHOTOS.length];
  const p2 = SAMPLE_PG_PHOTOS[(offset + 1) % SAMPLE_PG_PHOTOS.length];
  const p3 = SAMPLE_PG_PHOTOS[(offset + 2) % SAMPLE_PG_PHOTOS.length];
  return [
    { id: `sample-${pgId}-1`, imageName: p1.imageName, imageUrl: p1.imageUrl, pgListingId: pgId },
    { id: `sample-${pgId}-2`, imageName: p2.imageName, imageUrl: p2.imageUrl, pgListingId: pgId },
    { id: `sample-${pgId}-3`, imageName: p3.imageName, imageUrl: p3.imageUrl, pgListingId: pgId },
  ];
};
